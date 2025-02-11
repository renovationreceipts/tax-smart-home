
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyTypeSelect } from "./property/PropertyTypeSelect"
import { PurchaseDateField } from "./property/PurchaseDateField"
import { MoneyField } from "./property/MoneyField"
import { PropertyNameField } from "./property/PropertyNameField"
import { PropertyAddressField } from "./property/PropertyAddressField"
import { PropertyFormHeader } from "./property/PropertyFormHeader"
import { PropertyFormActions } from "./property/PropertyFormActions"
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
    lived_in_property_2_of_5_years: boolean
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
      propertyType: property.property_type,
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
      livedInProperty2of5Years: property.lived_in_property_2_of_5_years ?? true
    } : {
      propertyType: undefined,
      name: "",
      address: "",
      purchasePrice: "",
      purchaseDate: new Date(),
      currentValue: "",
      livedInProperty2of5Years: true
    },
  })

  console.log("Form default values:", form.getValues())

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
      <PropertyFormHeader isEditing={!!property} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitProperty)} className="space-y-4">
          <PropertyTypeSelect form={form} />
          <PropertyNameField form={form} />
          <PropertyAddressField form={form} />
          
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

          <FormField
            control={form.control}
            name="livedInProperty2of5Years"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lived in property for at least 2 of the last 5 years</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select yes or no" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PropertyFormActions 
            isEditing={!!property} 
            onCancel={onCancel}
          />
        </form>
      </Form>
    </div>
  )
}
