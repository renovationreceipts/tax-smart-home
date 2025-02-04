import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImagePreview } from "./preview/ImagePreview"
import { PDFPreview } from "./preview/PDFPreview"
import { GenericFilePreview } from "./preview/GenericFilePreview"
import { getFileUrl, getFileName, downloadFile } from "./utils/fileHandlers"
import type { ProjectFile } from "./types"

interface FilePreviewDialogProps {
  file: ProjectFile | null
  onClose: () => void
}

export function FilePreviewDialog({ file, onClose }: FilePreviewDialogProps) {
  if (!file) return null

  const fileUrl = getFileUrl(file.file_path)
  const fileName = getFileName(file.file_path)

  const handleDownload = async () => {
    try {
      await downloadFile(fileUrl, fileName)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const renderPreview = () => {
    if (file.file_type.startsWith('image/')) {
      return (
        <ImagePreview
          fileUrl={fileUrl}
          fileName={fileName}
          onDownload={handleDownload}
        />
      )
    }
    
    if (file.file_type === 'application/pdf') {
      return (
        <PDFPreview
          fileUrl={fileUrl}
          fileName={fileName}
          onDownload={handleDownload}
        />
      )
    }
    
    return <GenericFilePreview fileName={fileName} onDownload={handleDownload} />
  }

  return (
    <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>
        {renderPreview()}
      </DialogContent>
    </Dialog>
  )
}