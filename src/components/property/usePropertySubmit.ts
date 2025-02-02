import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { PropertyFormValues } from "./PropertyFormTypes"

export function usePropertySubmit(onSuccess?: () => void, propertyId?: string) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const submitProperty = async (data: PropertyFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to add a property.",
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
        address: data.address,
        purchase_price: numericPurchasePrice,
        purchase_date: format(data.purchaseDate, "yyyy-MM-dd"),
        current_value: numericCurrentValue,
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

      if (error) throw error

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