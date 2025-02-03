import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRef } from "react"

interface FileUploadButtonProps {
  value: FileList | null
  onChange: (files: FileList) => void
  multiple?: boolean
  accept?: string
  label: string
}

export function FileUploadButton({ value, onChange, multiple = false, accept, label }: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddFiles = () => {
    inputRef.current?.click()
  }

  const renderSelectedFiles = (files: FileList) => {
    if (!files?.length) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {Array.from(files).map((file, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
            {file.type.startsWith('image/') ? (
              <img 
                src={URL.createObjectURL(file)}
                alt="File preview"
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                📄
              </div>
            )}
            <span className="flex-1">{file.name}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept={accept}
        multiple={multiple}
        ref={inputRef}
        onChange={(e) => {
          const files = e.target.files
          if (files) {
            onChange(files)
          }
        }}
        className="hidden"
      />
      {(!value || (value as FileList)?.length === 0) ? (
        <Button
          type="button"
          variant="outline"
          className="w-full h-20 flex flex-col items-center justify-center gap-2"
          onClick={handleAddFiles}
        >
          <Plus className="h-6 w-6" />
          <span>{label}</span>
        </Button>
      ) : (
        <>
          {renderSelectedFiles(value)}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleAddFiles}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More Files
          </Button>
        </>
      )}
    </div>
  )
}