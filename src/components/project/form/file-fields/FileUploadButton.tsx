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
      <div className="space-y-4">
        {Array.from(files).map((file, index) => (
          <div 
            key={index} 
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex items-center gap-4">
              {file.type.startsWith('image/') ? (
                <img 
                  src={URL.createObjectURL(file)}
                  alt="File preview"
                  className="w-20 h-20 object-cover rounded-md"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                  📄
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  console.log("FileUploadButton value:", value)
  console.log("FileUploadButton value length:", value?.length)

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept={accept}
        multiple={false}
        ref={inputRef}
        onChange={(e) => {
          const files = e.target.files
          if (files) {
            onChange(files)
          }
        }}
        className="hidden"
      />
      {(!value || value.length === 0) && (
        <Button
          type="button"
          variant="outline"
          className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 border-dashed"
          onClick={handleAddFiles}
        >
          <Plus className="h-6 w-6" />
          <span>{label}</span>
        </Button>
      )}
      {value && value.length > 0 && renderSelectedFiles(value)}
    </div>
  )
}