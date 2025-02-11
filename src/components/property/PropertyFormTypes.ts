
import { z } from "zod"

export const propertyFormSchema = z.object({
  propertyType: z.enum(["PRIMARY_HOME", "SECOND_HOME", "RENTAL"], {
    required_error: "Please select a property type.",
  }),
  name: z.string().min(1, "Property name is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code is required"),
  purchasePrice: z.string().min(1, "Purchase price is required"),
  purchaseDate: z.date({
    required_error: "Purchase date is required.",
  }),
  currentValue: z.string().min(1, "Current property value is required"),
  livedInProperty2of5Years: z.boolean().default(true)
})

export type PropertyFormValues = z.infer<typeof propertyFormSchema>
