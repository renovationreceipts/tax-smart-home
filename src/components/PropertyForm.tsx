import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PropertyTypeSelect } from "./property/PropertyTypeSelect"
import { PurchaseDateField } from "./property/PurchaseDateField"
import { MoneyField } from "./property/MoneyField"
import { propertyFormSchema, type PropertyFormValues } from "./property/PropertyFormTypes"
import { usePropertySubmit } from "./property/usePropertySubmit"

interface PropertyFormProps {
  property?: {
    id: string
    property_type: "PRIMARY_HOME" | "SECOND_HOME" | "RENTAL"
    name: string
    address: string
    purchase_price: number
    purchase_date: string | null
    current_value: number
  }
  onCancel: () => void
  onSuccess?: () => void
}

export function PropertyForm({ property, onCancel, onSuccess }: PropertyFormProps) {
  const submitProperty = usePropertySubmit(onSuccess, property?.id)

  console.log("Property data received:", property)

  const defaultPurchaseDate = property?.purchase_date 
    ? new Date(property.purchase_date) 
    : new Date()

  console.log("Default purchase date:", defaultPurchaseDate)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: property ? {
      propertyType: property.property_type,  // This was the issue - property_type wasn't being mapped correctly
      name: property.name,
      address: property.address,
      purchasePrice: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(property.purchase_price),
      purchaseDate: defaultPurchaseDate,
      currentValue: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(property.current_value),
    } : {
      propertyType: undefined,
      name: "",
      address: "",
      purchasePrice: "",
      purchaseDate: new Date(),
      currentValue: "",
    },
  })

  console.log("Form default values:", form.getValues())

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold">
          {property ? "Edit Property" : "Add New Property"}
        </h2>
        <p className="text-muted-foreground">
          {property ? "Update your property details below." : "Enter your property details below."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitProperty)} className="space-y-4">
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
            <Button type="submit">
              {property ? "Update Property" : "Add Property"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}