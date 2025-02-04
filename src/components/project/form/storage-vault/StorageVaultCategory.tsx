import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FileList } from "../file-fields/FileList"
import { FileUploadButton } from "../file-fields/FileUploadButton"
import { useQueryClient } from "@tanstack/react-query"
import type { UseFormReturn } from "react-hook-form"
import type { ProjectFormValues } from "../ProjectFormTypes"
import type { ProjectFile } from "../file-fields/types"

interface StorageVaultCategoryProps {
  label: string
  fieldName: keyof ProjectFormValues
  form: UseFormReturn<ProjectFormValues>
  files: ProjectFile[]
  onPreview: (file: ProjectFile) => void
  onDelete: (fileId: string, filePath: string) => void
  accept?: string
  uploadLabel: string
  projectId?: string
}

export function StorageVaultCategory({
  label,
  fieldName,
  form,
  files,
  onPreview,
  onDelete,
  accept,
  uploadLabel,
  projectId
}: StorageVaultCategoryProps) {
  const queryClient = useQueryClient()
  
  console.log(`Rendering ${fieldName} category:`, { 
    files, 
    formValue: form.watch(fieldName) 
  })
  
  const handleFileChange = async (files: FileList) => {
    if (files.length === 0) return
    
    console.log(`File change for ${fieldName}:`, files[0].name)
    
    // Only take the first file since we want one file per category
    const file = files[0]
    form.setValue(fieldName, files)
    
    // Create a temporary file entry for immediate display
    const tempFile: ProjectFile = {
      id: `temp-${crypto.randomUUID()}`,
      file_path: file,
      file_type: file.type,
      file_category: fieldName.replace('Photos', '_photo').replace('receipts', 'receipt'),
      size: file.size
    }
    
    // Update the cache by replacing any existing files in this category with the new temp file
    queryClient.setQueryData(['project-files', projectId], (oldData: ProjectFile[] = []) => {
      // Remove any existing files in this category (temp or permanent)
      const otherFiles = oldData.filter(f => f.file_category !== tempFile.file_category)
      console.log(`Updating cache for ${fieldName}:`, [...otherFiles, tempFile])
      return [...otherFiles, tempFile]
    })
  }

  const handleDelete = (fileId: string, filePath: string) => {
    console.log(`Deleting file from ${fieldName}:`, { fileId, filePath })
    
    // Reset the form field value
    form.setValue(fieldName, null)
    
    // Call the original onDelete handler for permanent files
    if (!fileId.startsWith('temp-')) {
      onDelete(fileId, filePath)
    }
    
    // Update the cache to remove the file
    queryClient.setQueryData(['project-files', projectId], (oldData: ProjectFile[] = []) => {
      const updatedFiles = oldData.filter(file => file.id !== fileId)
      console.log(`Updated cache after deletion for ${fieldName}:`, updatedFiles)
      return updatedFiles
    })
  }

  // Filter files to only show the one for this category
  const categoryFiles = files.filter(file => 
    file.file_category === fieldName.replace('Photos', '_photo').replace('receipts', 'receipt')
  )

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: { value } }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold">{label}</FormLabel>
          <div className="min-h-[100px]">
            {categoryFiles.length === 0 ? (
              <FileUploadButton
                value={value as FileList | null}
                onChange={handleFileChange}
                multiple={false}
                accept={accept}
                label={uploadLabel}
              />
            ) : (
              <FileList
                files={categoryFiles}
                onPreview={onPreview}
                onDelete={handleDelete}
              />
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}