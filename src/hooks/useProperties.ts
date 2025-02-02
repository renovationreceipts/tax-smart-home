import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface Property {
  id: string
  name: string
  address: string
  purchase_price: number
  current_value: number
}

async function fetchProperties() {
  console.log("Fetching properties...")
  const { data, error } = await supabase
    .from("properties")
    .select("id, name, address, purchase_price, current_value")
  
  if (error) {
    console.error("Error fetching properties:", error)
    throw error
  }
  
  console.log("Properties fetched:", data)
  return data
}

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  })
}