import { z } from "zod"

export const propertyFormSchema = z.object({
  propertyType: z.enum(["PRIMARY_HOME", "SECOND_HOME", "RENTAL"], {
    required_error: "Please select a property type.",
  }),
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Property address is required"),
  purchasePrice: z.string().min(1, "Purchase price is required"),
  purchaseDate: z.date({
    required_error: "Purchase date is required.",
  }),
  currentValue: z.string().min(1, "Current property value is required"),
})

export type PropertyFormValues = z.infer<typeof propertyFormSchema>