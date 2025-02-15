
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface Project {
  id: string
  property_id: string
  name: string
  description: string | null
  cost: number
  completion_date: string
  created_at: string | null
  builder_name: string | null
  builder_url: string | null
  qualifies_for_basis: boolean | null
  ai_analysis_result: string | null
}

async function fetchProjects(propertyId: string) {
  // Validate that propertyId is a valid UUID using a regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(propertyId)) {
    console.log("Invalid property ID format:", propertyId)
    return []
  }

  console.log("Fetching projects for property:", propertyId)
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("property_id", propertyId)
    .order("completion_date", { ascending: false })
  
  if (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
  
  console.log("Projects fetched:", data)
  return data
}

export function useProjects(propertyId: string | null) {
  return useQuery({
    queryKey: ['projects', propertyId],
    queryFn: () => propertyId ? fetchProjects(propertyId) : Promise.resolve([]),
    enabled: !!propertyId,
  })
}
