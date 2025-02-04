import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { ProjectFile } from "../file-fields/types"

export function useProjectFiles(projectId?: string) {
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

      return (data as any[]).map(file => ({
        ...file,
        size: file.size || 0,
      })) as ProjectFile[]
    },
    enabled: !!projectId,
    staleTime: 1000, // Set a short stale time to ensure quick updates
    refetchInterval: 2000, // Refetch every 2 seconds while the component is mounted
  })

  return { existingFiles }
}