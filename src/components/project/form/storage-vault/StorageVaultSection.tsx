import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { FilePreviewDialog } from "../file-fields/FilePreviewDialog"
import { StorageVaultCategory } from "./StorageVaultCategory"
import type { UseFormReturn } from "react-hook-form"
import type { ProjectFormValues } from "../ProjectFormTypes"
import type { ProjectFile } from "../file-fields/types"

interface StorageVaultSectionProps {
  form: UseFormReturn<ProjectFormValues>
  projectId?: string
}

export function StorageVaultSection({ form, projectId }: StorageVaultSectionProps) {
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StorageVaultCategory
          label="Before Photo"
          fieldName="beforePhotos"
          form={form}
          files={existingFiles.filter(file => file.file_category === 'before_photo')}
          onPreview={setPreviewFile}
          onDelete={handleDeleteFile}
          accept="image/*"
          uploadLabel="Add Before Photo"
        />

        <StorageVaultCategory
          label="After Photo"
          fieldName="afterPhotos"
          form={form}
          files={existingFiles.filter(file => file.file_category === 'after_photo')}
          onPreview={setPreviewFile}
          onDelete={handleDeleteFile}
          accept="image/*"
          uploadLabel="Add After Photo"
        />

        <StorageVaultCategory
          label="Receipt"
          fieldName="receipts"
          form={form}
          files={existingFiles.filter(file => file.file_category === 'receipt')}
          onPreview={setPreviewFile}
          onDelete={handleDeleteFile}
          accept=".pdf,.jpg,.jpeg,.png"
          uploadLabel="Add Receipt"
        />
      </div>

      <FilePreviewDialog
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  )
}