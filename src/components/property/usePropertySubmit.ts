import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { PropertyFormValues } from "./PropertyFormTypes"

export function usePropertySubmit(onSuccess?: () => void) {
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

      const numericPurchasePrice = Number(data.purchasePrice.replace(/[^0-9.-]/g, ""))
      const numericCurrentValue = Number(data.currentValue.replace(/[^0-9.-]/g, ""))
      
      const { error } = await supabase
        .from("properties")
        .insert({
          user_id: user.id,
          property_type: data.propertyType,
          name: data.name,
          address: data.address,
          purchase_price: numericPurchasePrice / 100,
          purchase_date: format(data.purchaseDate, "yyyy-MM-dd"),
          current_value: numericCurrentValue / 100,
        })

      if (error) throw error

      if (onSuccess) {
        onSuccess()
      }

      toast({
        title: "Property Added",
        description: "Your property has been successfully added.",
      })
      
      navigate("/account")
    } catch (error) {
      console.error("Error adding property:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add property. Please try again.",
      })
    }
  }

  return submitProperty
}