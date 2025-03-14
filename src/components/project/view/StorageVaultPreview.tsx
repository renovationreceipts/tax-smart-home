
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getFileUrl, getFileName } from "@/components/project/form/file-fields/utils/fileListUtils"
import { FilePreviewDialog } from "@/components/project/form/file-fields/FilePreviewDialog"
import { ProjectFile } from "@/components/project/form/file-fields/types"
import { Eye } from "lucide-react"

interface StorageVaultPreviewProps {
  files: ProjectFile[]
}

export function StorageVaultPreview({ files }: StorageVaultPreviewProps) {
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null)

  const handlePreview = (file: ProjectFile) => {
    setPreviewFile(file)
  }

  const renderFilePreview = (files: ProjectFile[], category: string) => {
    const categoryFiles = files.filter(f => f.file_category === category)
    if (categoryFiles.length === 0) {
      return (
        <div className="min-h-[100px] p-4 border rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
          No files uploaded
        </div>
      )
    }

    return categoryFiles.map(file => (
      <div 
        key={file.id} 
        className="min-h-[100px] p-4 border rounded-lg bg-white hover:border-primary/50 transition-colors cursor-pointer group relative"
        onClick={() => handlePreview(file)}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
            {file.file_type.startsWith('image/') ? (
              <img 
                src={getFileUrl(file)}
                alt={getFileName(file)}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const imgElement = e.currentTarget
                  imgElement.onerror = null
                  imgElement.src = '/placeholder.svg'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-2xl">📄</div>
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">{getFileName(file)}</p>
            <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    ))
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Storage Vault</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium mb-4">Before Photos</h3>
              {renderFilePreview(files, 'before_photo')}
            </div>
            <div>
              <h3 className="font-medium mb-4">After Photos</h3>
              {renderFilePreview(files, 'after_photo')}
            </div>
            <div>
              <h3 className="font-medium mb-4">Receipts</h3>
              {renderFilePreview(files, 'receipt')}
            </div>
          </div>
        </CardContent>
      </Card>

      <FilePreviewDialog
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </>
  )
}
