import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
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

  const handleDownload = () => {
    const fileUrl = getFileUrl(file.file_path)
    const fileName = file.file_path.split('/').pop() || 'download'
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderPreview = () => {
    const fileUrl = getFileUrl(file.file_path)
    const fileName = file.file_path.split('/').pop() || 'File'

    if (file.file_type.startsWith('image/')) {
      return (
        <div className="space-y-4">
          <img 
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-[60vh] object-contain mx-auto"
          />
          <div className="flex justify-center">
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          </div>
        </div>
      )
    } else if (file.file_type === 'application/pdf') {
      return (
        <div className="space-y-4">
          <iframe
            src={`${fileUrl}#toolbar=0`}
            className="w-full h-[60vh]"
            title={fileName}
          />
          <div className="flex justify-center">
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="p-8 text-center space-y-4">
          <p className="text-gray-600">This file type cannot be previewed.</p>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download File
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