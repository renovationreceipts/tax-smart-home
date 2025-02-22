
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PropertyFormHeader } from "@/components/property/PropertyFormHeader"
import { PropertyFormActions } from "@/components/property/PropertyFormActions"
import { PropertyBasicFields } from "@/components/property/form/PropertyBasicFields"
import { PropertyAddressFields } from "@/components/property/form/PropertyAddressFields"
import { PropertyFinancialFields } from "@/components/property/form/PropertyFinancialFields"
import { PropertyEligibilityFields } from "@/components/property/form/PropertyEligibilityFields"
import { Property } from "@/hooks/useProperties"

const formSchema = z.object({
  propertyType: z.enum(["PRIMARY_HOME", "SECOND_HOME", "RENTAL"]),
  name: z.string().min(2, {
    message: "Property name must be at least 2 characters.",
  }),
  streetAddress: z.string().min(2, {
    message: "Street address must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
  purchasePrice: z.string().min(1, {
    message: "Purchase price is required.",
  }),
  purchaseDate: z.date(),
  currentValue: z.string().min(1, {
    message: "Current value is required.",
  }),
  livedInProperty2of5Years: z.boolean().default(true).optional(),
})

export type PropertyFormValues = z.infer<typeof formSchema>

interface PropertyFormProps {
  property?: Property
  propertyId?: string
  onCancel: () => void
  onSuccess: () => void
}

export function PropertyForm({ property, propertyId, onCancel, onSuccess }: PropertyFormProps) {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
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

  function onSubmit(values: PropertyFormValues) {
    onSuccess()
    console.log(values)
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
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
