import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { ProjectFormValues } from "./ProjectFormTypes"

interface ProjectFileFieldsProps {
  form: UseFormReturn<ProjectFormValues>
  projectId?: string
}

interface ProjectFile {
  id: string
  file_path: string
  file_type: string
  file_category: string
}

export function ProjectFileFields({ form, projectId }: ProjectFileFieldsProps) {
  const { data: existingFiles = [] } = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: async () => {
      if (!projectId) return []
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
      
      if (error) {
        console.error('Error fetching project files:', error)
        return []
      }
      
      console.log('Fetched project files:', data)
      return data
    },
    enabled: !!projectId
  })

  const renderExistingFiles = (category: string) => {
    const files = existingFiles.filter(file => file.file_category === category)
    if (files.length === 0) return null

    return (
      <div className="mt-2 space-y-2">
        {files.map(file => (
          <div key={file.id} className="flex items-center gap-2 text-sm text-gray-600">
            {file.file_type.startsWith('image/') ? (
              <img 
                src={`${supabase.storage.from('project-files').getPublicUrl(file.file_path).data.publicUrl}`}
                alt="File preview"
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                📄
              </div>
            )}
            <span>{file.file_path.split('/').pop()}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <FormField
        control={form.control}
        name="beforePhotos"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Before Photos (Optional)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    onChange(files)
                  }
                }}
                {...field}
                className="h-14 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
              />
            </FormControl>
            {renderExistingFiles('before_photo')}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="afterPhotos"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>After Photos (Optional)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    onChange(files)
                  }
                }}
                {...field}
                className="h-14 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
              />
            </FormControl>
            {renderExistingFiles('after_photo')}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="receipts"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Receipts (Optional)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    onChange(files)
                  }
                }}
                {...field}
                className="h-14 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
              />
            </FormControl>
            {renderExistingFiles('receipt')}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}