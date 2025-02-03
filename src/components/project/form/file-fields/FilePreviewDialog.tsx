import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import type { ProjectFile } from "./types"

interface FilePreviewDialogProps {
  file: ProjectFile | null
  onClose: () => void
}

export function FilePreviewDialog({ file, onClose }: FilePreviewDialogProps) {
  if (!file) return null

  const getFileUrl = (filePath: string) => {
    return supabase.storage.from('project-files').getPublicUrl(filePath).data.publicUrl
  }

  const renderPreview = () => {
    const fileUrl = getFileUrl(file.file_path)
    const fileName = file.file_path.split('/').pop() || 'File'

    if (file.file_type.startsWith('image/')) {
      return (
        <img 
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-[80vh] object-contain"
        />
      )
    } else if (file.file_type === 'application/pdf') {
      return (
        <iframe
          src={`${fileUrl}#toolbar=0`}
          className="w-full h-[80vh]"
          title={fileName}
        />
      )
    } else {
      return (
        <div className="p-4 text-center">
          <p>This file type cannot be previewed.</p>
          <Button asChild className="mt-4">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              Download File
            </a>
          </Button>
        </div>
      )
    }
  }

  return (
    <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file.file_path.split('/').pop()}</DialogTitle>
        </DialogHeader>
        {renderPreview()}
      </DialogContent>
    </Dialog>
  )
}