import { FileListItem } from "./FileListItem"
import { getFileUrl, getFileName } from "./utils/fileListUtils"
import type { ProjectFile } from "./types"

interface FileListProps {
  files: ProjectFile[]
  onPreview: (file: ProjectFile) => void
  onDelete: (fileId: string, filePath: string) => void
}

export function FileList({ files, onPreview, onDelete }: FileListProps) {
  if (files.length === 0) return null

  return (
    <div className="space-y-4">
      {files.map(file => (
        <FileListItem
          key={file.id}
          file={file}
          onPreview={onPreview}
          onDelete={onDelete}
          fileUrl={getFileUrl(file)}
          fileName={getFileName(file)}
        />
      ))}
    </div>
  )
}