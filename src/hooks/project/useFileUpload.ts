
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export async function useFileUpload() {
  const { toast } = useToast()

  const handleFileUpload = async (files: FileList, category: string, projectId: string) => {
    console.log(`Uploading ${files.length} files for category: ${category}`)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("User must be logged in to upload files")
    }
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      })

      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const filePath = `${projectId}/${crypto.randomUUID()}.${fileExt}`

      console.log(`Preparing to upload file: ${file.name} to path: ${filePath}`)
      
      let contentType = file.type
      if (fileExt === 'ico') {
        contentType = 'image/x-icon'
      }
      
      console.log('Using content type:', contentType)

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file, {
          upsert: false,
          contentType: contentType
        })

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        toast({
          variant: "destructive",
          title: "Upload Error",
          description: `Failed to upload ${file.name}: ${uploadError.message}`,
        })
        continue
      }

      console.log('File uploaded successfully, saving metadata to database')

      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          user_id: user.id,
          file_path: filePath,
          file_type: contentType,
          file_category: category,
        })

      if (dbError) {
        console.error('Error saving file metadata:', dbError)
        toast({
          variant: "destructive",
          title: "Database Error",
          description: `Failed to save metadata for ${file.name}: ${dbError.message}`,
        })
      }
    }
  }

  return { handleFileUpload }
}
