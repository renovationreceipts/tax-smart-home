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

  if (files.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {files.map(file => (
        <div key={file.id} className="relative group">
          <button
            type="button"
            onClick={() => onPreview(file)}
            className="w-full"
          >
            {file.file_type.startsWith('image/') ? (
              <img 
                src={getFileUrl(file.file_path)}
                alt="File preview"
                className="w-full aspect-square object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                <div className="text-2xl">📄</div>
              </div>
            )}
          </button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onDelete(file.id, file.file_path)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Delete file</span>
          </Button>
        </div>
      ))}
    </div>
  )
}