import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PDFPreviewProps {
  fileUrl: string
  fileName: string
  onDownload: () => void
}

export function PDFPreview({ fileUrl, fileName, onDownload }: PDFPreviewProps) {
  return (
    <div className="space-y-4">
      <iframe
        src={`${fileUrl}#toolbar=0`}
        className="w-full h-[60vh]"
        title={fileName}
      />
      <div className="flex justify-center">
        <Button onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  )
}