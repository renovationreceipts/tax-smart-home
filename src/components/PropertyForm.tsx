import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { PropertyTypeSelect } from "./property/PropertyTypeSelect"
import { PurchaseDateField } from "./property/PurchaseDateField"
import { MoneyField } from "./property/MoneyField"
import { propertyFormSchema, type PropertyFormValues } from "./property/PropertyFormTypes"
import { format } from "date-fns"

interface PropertyFormProps {
  onCancel: () => void
  onSuccess?: () => void
}

export function PropertyForm({ onCancel, onSuccess }: PropertyFormProps) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      purchasePrice: "",
      currentValue: "",
    },
  })

  async function onSubmit(data: PropertyFormValues) {
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

      toast({
        title: "Property Added",
        description: "Your property has been successfully added.",
      })
      
      if (onSuccess) {
        onSuccess()
      }
      
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

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold">Add New Property</h2>
        <p className="text-muted-foreground">Enter your property details below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <PropertyTypeSelect form={form} />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Name/Description</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Beach House" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <MoneyField 
            form={form}
            name="purchasePrice"
            label="Purchase Price"
          />

          <PurchaseDateField form={form} />

          <MoneyField 
            form={form}
            name="currentValue"
            label="Current Property Value"
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Property</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}