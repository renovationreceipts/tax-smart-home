import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { FilePreviewDialog } from "./file-fields/FilePreviewDialog"
import { FileList } from "./file-fields/FileList"
import { FileUploadButton } from "./file-fields/FileUploadButton"
import type { UseFormReturn } from "react-hook-form"
import type { ProjectFormValues } from "./ProjectFormTypes"
import type { ProjectFile } from "./file-fields/types"

interface ProjectFileFieldsProps {
  form: UseFormReturn<ProjectFormValues>
  projectId?: string
}

export function ProjectFileFields({ form, projectId }: ProjectFileFieldsProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null)

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
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([filePath])

      if (storageError) {
        console.error('Error deleting file from storage:', storageError)
        throw storageError
      }

      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId)

      if (dbError) {
        console.error('Error deleting file from database:', dbError)
        throw dbError
      }

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

  return (
    <div className="space-y-8">
      <div className="text-xl font-bold mb-6">Storage Vault</div>
      <FormField
        control={form.control}
        name="beforePhotos"
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Before Photos</FormLabel>
            <div className="mt-2 space-y-4">
              <FileUploadButton
                value={value}
                onChange={onChange}
                multiple
                accept="image/*"
                label="Add Before Photos"
              />
              <FileList
                files={existingFiles.filter(file => file.file_category === 'before_photo')}
                onPreview={setPreviewFile}
                onDelete={handleDeleteFile}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="afterPhotos"
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">After Photos</FormLabel>
            <div className="mt-2 space-y-4">
              <FileUploadButton
                value={value}
                onChange={onChange}
                multiple
                accept="image/*"
                label="Add After Photos"
              />
              <FileList
                files={existingFiles.filter(file => file.file_category === 'after_photo')}
                onPreview={setPreviewFile}
                onDelete={handleDeleteFile}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="receipts"
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Receipts</FormLabel>
            <div className="mt-2 space-y-4">
              <FileUploadButton
                value={value}
                onChange={onChange}
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                label="Add Receipts"
              />
              <FileList
                files={existingFiles.filter(file => file.file_category === 'receipt')}
                onPreview={setPreviewFile}
                onDelete={handleDeleteFile}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FilePreviewDialog
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  )
}