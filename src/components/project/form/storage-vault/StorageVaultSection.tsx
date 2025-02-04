import { useState } from "react"
import { FilePreviewDialog } from "../file-fields/FilePreviewDialog"
import { StorageVaultCategory } from "./StorageVaultCategory"
import { StorageVaultHeader } from "./StorageVaultHeader"
import { useFileOperations } from "./useFileOperations"
import { useProjectFiles } from "./useProjectFiles"
import type { UseFormReturn } from "react-hook-form"
import type { ProjectFormValues } from "../ProjectFormTypes"
import type { ProjectFile } from "../file-fields/types"

interface StorageVaultSectionProps {
  form: UseFormReturn<ProjectFormValues>
  projectId?: string
}

export function StorageVaultSection({ form, projectId }: StorageVaultSectionProps) {
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null)
  const { existingFiles } = useProjectFiles(projectId)
  const { handleDeleteFile } = useFileOperations(projectId)

  return (
    <div className="space-y-8">
      <StorageVaultHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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