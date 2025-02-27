
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "./useAuth"
import { FREE_TIER_LIMITS } from "./usePremiumStatus"

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
  tax_credits_eligible: boolean | null
  tax_credits_analysis: string | null
  insurance_reduction_eligible: boolean | null
  insurance_reduction_analysis: string | null
}

async function fetchProjects(propertyId: string, userId: string | undefined) {
  // Validate that propertyId is a valid UUID using a regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(propertyId)) {
    console.error("Invalid property ID format:", propertyId)
    throw new Error("Invalid property ID format")
  }

  if (!userId) {
    console.error("No authenticated user found")
    throw new Error("Authentication required")
  }

  console.log("Fetching projects for property:", propertyId)
  
  // First verify the user owns this property
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("user_id", userId)
    .single()

  if (propertyError || !property) {
    console.error("Property not found or access denied")
    throw new Error("Property not found or access denied")
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("property_id", propertyId)
    .eq("user_id", userId)
    .order("completion_date", { ascending: false })
  
  if (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
  
  console.log("Projects fetched:", data)
  return data
}

async function fetchAllUserProjects(userId: string | undefined) {
  if (!userId) {
    console.error("No authenticated user found")
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
  
  if (error) {
    console.error("Error fetching all user projects:", error)
    throw error
  }
  
  return data || []
}

export function useProjects(propertyId: string | null) {
  const { user, isAuthenticated, isInitialized } = useAuth()
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['projects', propertyId, user?.id],
    queryFn: () => propertyId ? fetchProjects(propertyId, user?.id) : Promise.resolve([]),
    enabled: isAuthenticated && isInitialized && !!propertyId && !!user?.id,
    staleTime: 0, // Consider data immediately stale
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: (failureCount, error) => {
      // Don't retry on authentication or access denied errors
      if (error instanceof Error && 
         (error.message === "Authentication required" || 
          error.message === "Property not found or access denied")) {
        return false
      }
      return failureCount < 3
    }
  })
}

export function useAllUserProjects() {
  const { user, isAuthenticated, isInitialized } = useAuth()

  return useQuery({
    queryKey: ['all-user-projects', user?.id],
    queryFn: () => fetchAllUserProjects(user?.id),
    enabled: isAuthenticated && isInitialized && !!user?.id,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    refetchOnMount: true,
  });
}

export function useProjectLimitCheck() {
  const { data: allProjects = [], isLoading } = useAllUserProjects();
  
  const hasReachedLimit = allProjects.length >= FREE_TIER_LIMITS.PROJECT_LIMIT;
  const projectsCount = allProjects.length;
  
  return {
    hasReachedLimit,
    projectsCount,
    isLoading,
    maxProjects: FREE_TIER_LIMITS.PROJECT_LIMIT
  };
}

// Export a function to invalidate projects cache
export function invalidateProjectsCache(queryClient: any, propertyId: string) {
  queryClient.invalidateQueries({
    queryKey: ['projects', propertyId]
  })
  queryClient.invalidateQueries({
    queryKey: ['all-user-projects']
  })
}
