import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { ProjectFile } from "../file-fields/types"

export function useProjectFiles(projectId?: string) {
  const { data: existingFiles = [] } = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: async () => {
      if (!projectId) return []
      
      console.log("Fetching project files for project:", projectId)
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
      
      if (error) {
        console.error('Error fetching project files:', error)
        return []
      }
      
      console.log('Fetched project files:', data)
      
      const filesWithUrls = (data as any[]).map(file => ({
        id: file.id,
        file_path: file.file_path,
        file_type: file.file_type || 'application/octet-stream',
        file_category: file.file_category,
        size: file.size || 0,
      })) as ProjectFile[]

      console.log('Files with URLs:', filesWithUrls)
      return filesWithUrls
    },
    enabled: !!projectId,
    // Only refetch when the query window is refocused
    staleTime: Infinity,
    // Remove the aggressive refetch interval
    gcTime: 0,
  })

  return { existingFiles }
}