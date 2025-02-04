import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { ProjectFile } from "./types"

interface FileListItemProps {
  file: ProjectFile
  onPreview: (file: ProjectFile) => void
  onDelete: (fileId: string, filePath: string) => void
  fileUrl: string
  fileName: string
}

export function FileListItem({ file, onPreview, onDelete, fileUrl, fileName }: FileListItemProps) {
  const isTemp = file.id.startsWith('temp-')
  
  console.log('Rendering file item:', { 
    id: file.id, 
    isTemp, 
    type: file.file_type,
    path: file.file_path instanceof File ? file.file_path.name : file.file_path 
  })

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  return (
    <div 
      className={`relative group bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors ${
        isTemp ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <button 
          type="button"
          onClick={() => onPreview(file)}
          className="w-12 h-12 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded overflow-hidden"
        >
          {file.file_type.startsWith('image/') ? (
            <img 
              src={fileUrl}
              alt={fileName}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image load error:', e)
                const imgElement = e.currentTarget
                imgElement.onerror = null
                imgElement.src = '/placeholder.svg'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center">
              <div className="text-2xl">📄</div>
            </div>
          )}
        </button>
        <button
          type="button"
          onClick={() => onPreview(file)}
          className="flex-1 min-w-0 text-left focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
        >
          <p className="text-sm font-medium text-gray-900 truncate">
            {fileName}
            {isTemp && " (Uploading...)"}
          </p>
          <p className="text-sm text-gray-500">
            {formatFileSize(file.size)}
          </p>
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(file.id, typeof file.file_path === 'string' ? file.file_path : file.file_path.name)}
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  )
}