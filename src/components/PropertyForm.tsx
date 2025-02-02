import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
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

          <PropertyFormActions 
            isEditing={!!property} 
            onCancel={onCancel}
          />
        </form>
      </Form>
    </div>
  )
}