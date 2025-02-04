import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ImagePreviewProps {
  fileUrl: string
  fileName: string
  onDownload: () => void
}

export function ImagePreview({ fileUrl, fileName, onDownload }: ImagePreviewProps) {
  return (
    <div className="space-y-4">
      <img 
        src={fileUrl}
        alt={fileName}
        className="max-w-full max-h-[60vh] object-contain mx-auto"
      />
      <div className="flex justify-center">
        <Button onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Image
        </Button>
      </div>
    </div>
  )
}