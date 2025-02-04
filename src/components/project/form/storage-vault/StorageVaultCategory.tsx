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
  const hasExistingFiles = files.length > 0;
  const currentValue = form.watch(fieldName) as FileList | null;
  const hasSelectedFiles = currentValue && currentValue.length > 0;
  const shouldShowUploadButton = !hasExistingFiles && !hasSelectedFiles;

  const handleFileChange = (files: FileList) => {
    form.setValue(fieldName, files);
    // Immediately invalidate the project files query to trigger a refetch
    if (projectId) {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
    }
  };

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