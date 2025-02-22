
import { z } from "zod"

export const propertyFormSchema = z.object({
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

export type PropertyFormValues = z.infer<typeof propertyFormSchema>
