import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FileList } from "../file-fields/FileList"
import { FileUploadButton } from "../file-fields/FileUploadButton"
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
}

export function StorageVaultCategory({
  label,
  fieldName,
  form,
  files,
  onPreview,
  onDelete,
  accept,
  uploadLabel
}: StorageVaultCategoryProps) {
  // Only show upload button if there are no existing files
  const hasExistingFiles = files.length > 0;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: { onChange, value } }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold">{label}</FormLabel>
          <div className="mt-2 space-y-4">
            {!hasExistingFiles && (
              <FileUploadButton
                value={value as FileList | null}
                onChange={onChange}
                multiple={false}
                accept={accept}
                label={uploadLabel}
              />
            )}
            <FileList
              files={files}
              onPreview={onPreview}
              onDelete={onDelete}
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}