import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UseFormReturn } from "react-hook-form"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Trash2, Eye, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState, useRef } from "react"
import type { ProjectFormValues } from "./ProjectFormTypes"

interface ProjectFileFieldsProps {
  form: UseFormReturn<ProjectFormValues>
  projectId?: string
}

interface ProjectFile {
  id: string
  file_path: string
  file_type: string
  file_category: string
}

export function ProjectFileFields({ form, projectId }: ProjectFileFieldsProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null)
  const beforePhotosRef = useRef<HTMLInputElement>(null)
  const afterPhotosRef = useRef<HTMLInputElement>(null)
  const receiptsRef = useRef<HTMLInputElement>(null)

  const { data: existingFiles = [] } = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: async () => {
      if (!projectId) return []
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
      
      if (error) {
        console.error('Error fetching project files:', error)
        return []
      }
      
      console.log('Fetched project files:', data)
      return data
    },
    enabled: !!projectId
  })

  const handleDeleteFile = async (fileId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([filePath])

      if (storageError) {
        console.error('Error deleting file from storage:', storageError)
        throw storageError
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId)

      if (dbError) {
        console.error('Error deleting file from database:', dbError)
        throw dbError
      }

      // Invalidate query to refresh the file list
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] })

      toast({
        title: "Success",
        description: "File deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file. Please try again.",
      })
    }
  }

  const getFileUrl = (filePath: string) => {
    return supabase.storage.from('project-files').getPublicUrl(filePath).data.publicUrl
  }

  const renderFilePreview = () => {
    if (!previewFile) return null

    const fileUrl = getFileUrl(previewFile.file_path)
    const fileName = previewFile.file_path.split('/').pop() || 'File'

    if (previewFile.file_type.startsWith('image/')) {
      return (
        <img 
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-[80vh] object-contain"
        />
      )
    } else if (previewFile.file_type === 'application/pdf') {
      return (
        <iframe
          src={`${fileUrl}#toolbar=0`}
          className="w-full h-[80vh]"
          title={fileName}
        />
      )
    } else {
      return (
        <div className="p-4 text-center">
          <p>This file type cannot be previewed.</p>
          <Button asChild className="mt-4">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              Download File
            </a>
          </Button>
        </div>
      )
    }
  }

  const renderExistingFiles = (category: string) => {
    const files = existingFiles.filter(file => file.file_category === category)
    if (files.length === 0) return null

    return (
      <div className="mt-2 space-y-2">
        {files.map(file => (
          <div key={file.id} className="flex items-center gap-2 text-sm text-gray-600 group">
            <button
              type="button"
              onClick={() => setPreviewFile(file)}
              className="flex items-center gap-2 flex-1 hover:text-gray-900"
            >
              {file.file_type.startsWith('image/') ? (
                <img 
                  src={getFileUrl(file.file_path)}
                  alt="File preview"
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  📄
                </div>
              )}
              <span>{file.file_path.split('/').pop()}</span>
            </button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteFile(file.id, file.file_path)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span className="sr-only">Delete file</span>
            </Button>
          </div>
        ))}
      </div>
    )
  }

  const renderSelectedFiles = (files: FileList | null) => {
    if (!files?.length) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {Array.from(files).map((file, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
            {file.type.startsWith('image/') ? (
              <img 
                src={URL.createObjectURL(file)}
                alt="File preview"
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                📄
              </div>
            )}
            <span className="flex-1">{file.name}</span>
          </div>
        ))}
      </div>
    )
  }

  const handleAddMoreFiles = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click()
  }

  return (
    <>
      <FormField
        control={form.control}
        name="beforePhotos"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Before Photos (Optional)</FormLabel>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                ref={beforePhotosRef}
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    onChange(files)
                  }
                }}
                {...field}
                className="hidden"
              />
              {(!value || (value as FileList)?.length === 0) ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleAddMoreFiles(beforePhotosRef)}
                >
                  <Plus className="h-6 w-6" />
                  <span>Add Before Photos</span>
                </Button>
              ) : (
                <>
                  {renderSelectedFiles(value as FileList)}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddMoreFiles(beforePhotosRef)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Photos
                  </Button>
                </>
              )}
            </div>
            {renderExistingFiles('before_photo')}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="afterPhotos"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>After Photos (Optional)</FormLabel>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                ref={afterPhotosRef}
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    onChange(files)
                  }
                }}
                {...field}
                className="hidden"
              />
              {(!value || (value as FileList)?.length === 0) ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleAddMoreFiles(afterPhotosRef)}
                >
                  <Plus className="h-6 w-6" />
                  <span>Add After Photos</span>
                </Button>
              ) : (
                <>
                  {renderSelectedFiles(value as FileList)}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddMoreFiles(afterPhotosRef)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Photos
                  </Button>
                </>
              )}
            </div>
            {renderExistingFiles('after_photo')}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="receipts"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Receipts (Optional)</FormLabel>
            <div className="space-y-4">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                ref={receiptsRef}
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    onChange(files)
                  }
                }}
                {...field}
                className="hidden"
              />
              {(!value || (value as FileList)?.length === 0) ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleAddMoreFiles(receiptsRef)}
                >
                  <Plus className="h-6 w-6" />
                  <span>Add Receipts</span>
                </Button>
              ) : (
                <>
                  {renderSelectedFiles(value as FileList)}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddMoreFiles(receiptsRef)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Files
                  </Button>
                </>
              )}
            </div>
            {renderExistingFiles('receipt')}
            <FormMessage />
          </FormItem>
        )}
      />

      <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.file_path.split('/').pop()}</DialogTitle>
          </DialogHeader>
          {renderFilePreview()}
        </DialogContent>
      </Dialog>
    </>
  )
}
