import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import type { ProjectFile } from "./types"

interface FileListProps {
  files: ProjectFile[]
  onPreview: (file: ProjectFile) => void
  onDelete: (fileId: string, filePath: string) => void
}

export function FileList({ files, onPreview, onDelete }: FileListProps) {
  const getFileUrl = (filePath: string | File) => {
    if (filePath instanceof File) {
      return URL.createObjectURL(filePath)
    }
    // Always generate a fresh URL to avoid caching issues
    const { data } = supabase.storage.from('project-files').getPublicUrl(filePath)
    console.log('Generated file URL:', data.publicUrl)
    return data.publicUrl
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const getFileName = (file: ProjectFile) => {
    const filePath = file.file_path
    if (filePath instanceof File) {
      return filePath.name
    }
    return filePath.split('/').pop() || 'Unknown file'
  }

  const getFileType = (file: ProjectFile) => {
    const filePath = file.file_path
    if (filePath instanceof File) {
      return filePath.type
    }
    return file.file_type
  }

  if (files.length === 0) return null

  return (
    <div className="space-y-4">
      {files.map(file => {
        const isTemp = file.id.startsWith('temp-')
        const fileUrl = getFileUrl(file.file_path)
        console.log('Rendering file:', { file, fileUrl, type: getFileType(file) })
        
        return (
          <div 
            key={file.id} 
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
                {getFileType(file).startsWith('image/') ? (
                  <img 
                    src={fileUrl}
                    alt={getFileName(file)}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image load error:', e)
                      const imgElement = e.currentTarget
                      imgElement.onerror = null // Prevent infinite loop
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
                  {getFileName(file)}
                  {isTemp && " (Uploading...)"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </button>
              {!isTemp && (
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
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}