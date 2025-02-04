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
      
      // Transform the data to include public URLs for files
      const filesWithUrls = (data as any[]).map(file => ({
        ...file,
        size: file.size || 0,
        file_path: file.file_path,
        file_type: file.file_type || 'application/octet-stream',
      })) as ProjectFile[]

      console.log('Files with URLs:', filesWithUrls)
      return filesWithUrls
    },
    enabled: !!projectId,
    staleTime: 0, // No stale time to always fetch fresh data
    refetchInterval: 1000, // Refetch every second while component is mounted
  })

  return { existingFiles }
}