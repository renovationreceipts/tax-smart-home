import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
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

  if (files.length === 0) return null

  return (
    <div className="mt-2 space-y-2">
      {files.map(file => (
        <div key={file.id} className="flex items-center gap-2 text-sm text-gray-600 group">
          <button
            type="button"
            onClick={() => onPreview(file)}
            className="flex items-center gap-2 flex-1 hover:text-gray-900"
          >
            {file.file_type.startsWith('image/') ? (
              <img 
                src={getFileUrl(file.file_path)}
                alt="File preview"
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                📄
              </div>
            )}
            <span>{file.file_path.split('/').pop()}</span>
          </button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(file.id, file.file_path)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="sr-only">Delete file</span>
          </Button>
        </div>
      ))}
    </div>
  )
}