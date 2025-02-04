import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface GenericFilePreviewProps {
  fileName: string
  onDownload: () => void
}

export function GenericFilePreview({ fileName, onDownload }: GenericFilePreviewProps) {
  return (
    <div className="p-8 text-center space-y-4">
      <p className="text-gray-600">This file type cannot be previewed.</p>
      <Button onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download File
      </Button>
    </div>
  )
}