import { supabase } from "@/integrations/supabase/client"
import type { ProjectFile } from "../types"

export const getFileUrl = (file: ProjectFile) => {
  // For temporary files (newly uploaded), use the File object directly
  if (file.id.startsWith('temp-') && file.file_path instanceof File) {
    console.log('Creating blob URL for temp file:', file.file_path.name)
    return URL.createObjectURL(file.file_path)
  }
  
  // For stored files, get the Supabase URL
  if (typeof file.file_path === 'string') {
    const { data } = supabase.storage.from('project-files').getPublicUrl(file.file_path)
    console.log('Generated Supabase URL:', data.publicUrl)
    return data.publicUrl
  }

  console.log('Unable to generate URL for file:', file)
  return ''
}

export const getFileName = (file: ProjectFile) => {
  const filePath = file.file_path
  if (filePath instanceof File) {
    return filePath.name
  }
  return filePath.split('/').pop() || 'Unknown file'
}