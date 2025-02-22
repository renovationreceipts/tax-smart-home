
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

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

async function fetchProperties() {
  console.log("Fetching properties...")
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error("No authenticated user found")
    return []
  }

  const { data, error } = await supabase
    .from("properties")
    .select("id, property_type, name, street_address, city, state, zip_code, purchase_price, purchase_date, current_value, lived_in_property_2_of_5_years")
    .eq('user_id', user.id)
    .returns<Property[]>()
  
  if (error) {
    console.error("Error fetching properties:", error)
    throw error
  }
  
  console.log("Properties fetched:", data)
  return data || []
}

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes
  })
}
