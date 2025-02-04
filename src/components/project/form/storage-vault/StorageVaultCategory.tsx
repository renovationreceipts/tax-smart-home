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
  const currentValue = form.watch(fieldName) as FileList | null;
  
  const handleFileChange = async (files: FileList) => {
    console.log("File change detected:", files)
    form.setValue(fieldName, files);
    
    // Create temporary file entries for immediate display
    const tempFiles: ProjectFile[] = Array.from(files).map(file => ({
      id: `temp-${crypto.randomUUID()}`,
      file_path: file,
      file_type: file.type,
      file_category: fieldName.replace('Photos', '_photo').replace('receipts', 'receipt'),
      size: file.size
    }));
    
    // Update the cache by merging existing files with temp files
    queryClient.setQueryData(['project-files', projectId], (oldData: ProjectFile[] = []) => {
      const existingFiles = oldData.filter(file => !file.id.startsWith('temp-'));
      console.log("Updating cache with temp files:", [...existingFiles, ...tempFiles])
      return [...existingFiles, ...tempFiles]
    });
  };

  // Show upload button if there are no files at all (including temporary ones)
  const shouldShowUploadButton = files.length === 0;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: { value } }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold">{label}</FormLabel>
          <div className="min-h-[100px]">
            {shouldShowUploadButton ? (
              <FileUploadButton
                value={value as FileList | null}
                onChange={handleFileChange}
                multiple={false}
                accept={accept}
                label={uploadLabel}
              />
            ) : (
              <FileList
                files={files}
                onPreview={onPreview}
                onDelete={onDelete}
              />
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}