
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "./useAuth"
import { FREE_TIER_LIMITS } from "./usePremiumStatus"
import { usePremiumStatus } from "./usePremiumStatus"

export interface Property {
  id: string
  property_type: "PRIMARY_HOME" | "SECOND_HOME" | "RENTAL"
  name: string
  street_address: string
  city: string
  state: string
  zip_code: string
  purchase_price: number
  purchase_date: string
  current_value: number
  lived_in_property_2_of_5_years: boolean | null
}

async function fetchProperties(userId: string | undefined) {
  if (!userId) {
    console.error("No authenticated user found")
    throw new Error("Authentication required")
  }

  console.log("Fetching properties for user:", userId)
  
  const { data, error } = await supabase
    .from("properties")
    .select("id, property_type, name, street_address, city, state, zip_code, purchase_price, purchase_date, current_value, lived_in_property_2_of_5_years")
    .eq('user_id', userId)
    .returns<Property[]>()
  
  if (error) {
    console.error("Error fetching properties:", error)
    throw error
  }
  
  console.log("Properties fetched:", data)
  return data || []
}

export function useProperties() {
  const { user, isAuthenticated, isInitialized } = useAuth()

  return useQuery({
    queryKey: ['properties', user?.id],
    queryFn: () => fetchProperties(user?.id),
    enabled: isAuthenticated && isInitialized,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof Error && error.message === "Authentication required") {
        return false
      }
      return failureCount < 3
    }
  })
}

export function usePropertyLimitCheck() {
  const { data: properties = [], isLoading } = useProperties();
  const { isPremium } = usePremiumStatus();
  
  // Premium users have no property limit
  const hasReachedLimit = !isPremium && properties.length >= FREE_TIER_LIMITS.PROPERTY_LIMIT;
  const propertiesCount = properties.length;
  
  return {
    hasReachedLimit,
    propertiesCount,
    isLoading,
    maxProperties: FREE_TIER_LIMITS.PROPERTY_LIMIT
  };
}
