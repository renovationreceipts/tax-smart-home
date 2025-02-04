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

      // Transform the data to include a default size if not present
      return (data as any[]).map(file => ({
        ...file,
        size: file.size || 0, // Default to 0 if size is not present
      })) as ProjectFile[]
    },
    enabled: !!projectId
  })

  return { existingFiles }
}