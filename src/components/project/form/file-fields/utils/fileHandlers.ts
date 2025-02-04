import { supabase } from "@/integrations/supabase/client"

export const getFileUrl = (filePath: string | File) => {
  if (filePath instanceof File) {
    return URL.createObjectURL(filePath)
  }
  return supabase.storage.from('project-files').getPublicUrl(filePath).data.publicUrl
}

export const getFileName = (filePath: string | File) => {
  if (filePath instanceof File) {
    return filePath.name
  }
  return filePath.split('/').pop() || 'download'
}

export const downloadFile = async (fileUrl: string, fileName: string) => {
  try {
    const response = await fetch(fileUrl)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}