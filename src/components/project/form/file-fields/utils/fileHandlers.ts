
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
    
    // Instead of appending to document.body, we'll use click() directly
    link.style.display = 'none'
    link.click()

    // Cleanup the blob URL after a short delay to ensure the download has started
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl)
    }, 100)
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}
