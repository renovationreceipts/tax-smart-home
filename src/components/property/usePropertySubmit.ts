
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { PropertyFormValues } from "./form/types"

interface UsePropertySubmitOptions {
  onSuccess?: () => void
  propertyId?: string
}

export function usePropertySubmit({ onSuccess, propertyId }: UsePropertySubmitOptions) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const submitProperty = async (data: PropertyFormValues) => {
    try {
      // First check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error("Error checking session:", sessionError)
        toast({
          variant: "destructive",
          title: "Session Error",
          description: "There was an error verifying your session. Please try logging in again.",
        })
        navigate("/login", { replace: true })
        return
      }

      if (!session) {
        console.error("No active session found")
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to add or edit properties.",
        })
        navigate("/login", { replace: true })
        return
      }

      // Now we know we have a valid session, get the user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error("Error getting user:", userError)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not verify user information. Please try logging in again.",
        })
        return
      }

      // Convert currency strings to numbers (removing currency formatting)
      const numericPurchasePrice = Number(data.purchasePrice.replace(/[^0-9.-]/g, ""))
      const numericCurrentValue = Number(data.currentValue.replace(/[^0-9.-]/g, ""))
      
      const propertyData = {
        user_id: user.id,
        property_type: data.propertyType,
        name: data.name,
        street_address: data.streetAddress,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        purchase_price: numericPurchasePrice,
        purchase_date: format(data.purchaseDate, "yyyy-MM-dd"),
        current_value: numericCurrentValue,
        lived_in_property_2_of_5_years: data.livedInProperty2of5Years
      }

      let error
      
      if (propertyId) {
        // Update existing property
        const { error: updateError } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", propertyId)
        error = updateError
      } else {
        // Insert new property
        const { error: insertError } = await supabase
          .from("properties")
          .insert(propertyData)
        error = insertError
      }

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      if (onSuccess) {
        onSuccess()
      }

      toast({
        title: propertyId ? "Property Updated" : "Property Added",
        description: propertyId 
          ? "Your property has been successfully updated."
          : "Your property has been successfully added.",
      })
      
      navigate("/account")
    } catch (error) {
      console.error("Error saving property:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save property. Please try again.",
      })
    }
  }

  return submitProperty
}
