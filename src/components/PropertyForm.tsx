
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PropertyFormHeader } from "@/components/property/PropertyFormHeader"
import { PropertyFormActions } from "@/components/property/PropertyFormActions"
import { PropertyBasicFields } from "@/components/property/form/PropertyBasicFields"
import { PropertyAddressFields } from "@/components/property/form/PropertyAddressFields"
import { PropertyFinancialFields } from "@/components/property/form/PropertyFinancialFields"
import { PropertyEligibilityFields } from "@/components/property/form/PropertyEligibilityFields"
import { Property } from "@/hooks/useProperties"
import { propertyFormSchema, PropertyFormValues } from "@/components/property/form/types"
import { usePropertySubmit } from "@/components/property/usePropertySubmit"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface PropertyFormProps {
  property?: Property
  propertyId?: string
  onCancel: () => void
  onSuccess: () => void
}

export function PropertyForm({ property, propertyId, onCancel, onSuccess }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { onSubmit: submitProperty } = usePropertySubmit({ property, onSuccess })

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      propertyType: property?.property_type || "PRIMARY_HOME",
      name: property?.name || "",
      streetAddress: property?.street_address || "",
      city: property?.city || "",
      state: property?.state || "",
      zipCode: property?.zip_code || "",
      purchasePrice: property?.purchase_price?.toString() || "",
      purchaseDate: property?.purchase_date ? new Date(property.purchase_date) : new Date(),
      currentValue: property?.current_value?.toString() || "",
      livedInProperty2of5Years: property?.lived_in_property_2_of_5_years ?? true,
    },
  })

  async function onSubmit(values: PropertyFormValues) {
    setIsSubmitting(true)
    try {
      await submitProperty(values)
    } catch (error) {
      console.error('Error submitting property:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="max-w-2xl mx-auto px-4">
          <PropertyFormHeader 
            isEditing={!!property}
          />
          
          <div className="space-y-8">
            <PropertyBasicFields form={form} />
            <PropertyAddressFields form={form} />
            <PropertyFinancialFields form={form} />
            <PropertyEligibilityFields form={form} />
          </div>
          
          <div className="pt-8">
            <PropertyFormActions 
              isEditing={!!property}
              propertyId={propertyId}
              onCancel={onCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
