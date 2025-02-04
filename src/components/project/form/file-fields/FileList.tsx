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
  const getFileUrl = (filePath: string) => {
    return supabase.storage.from('project-files').getPublicUrl(filePath).data.publicUrl
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  if (files.length === 0) return null

  return (
    <div className="space-y-4">
      {files.map(file => (
        <div 
          key={file.id} 
          className="relative group bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => onPreview(file)}
              className="w-12 h-12 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              {file.file_type.startsWith('image/') ? (
                <img 
                  src={getFileUrl(file.file_path)}
                  alt="File preview"
                  className="w-full h-full object-cover rounded"
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
                {file.file_path.split('/').pop()}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDelete(file.id, file.file_path)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}