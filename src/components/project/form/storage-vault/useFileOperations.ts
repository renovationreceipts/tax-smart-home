import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export function useFileOperations(projectId?: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleDeleteFile = async (fileId: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([filePath])

      if (storageError) {
        console.error('Error deleting file from storage:', storageError)
        throw storageError
      }

      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId)

      if (dbError) {
        console.error('Error deleting file from database:', dbError)
        throw dbError
      }

      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] })

      toast({
        title: "Success",
        description: "File deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file. Please try again.",
      })
    }
  }

  return { handleDeleteFile }
}