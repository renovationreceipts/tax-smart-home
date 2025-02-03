import { z } from "zod"
import type { Database } from "@/integrations/supabase/types"

export type TaxFormType = Database["public"]["Enums"]["tax_form_type"]

export const formSchema = z.object({
  formType: z.enum(["8949", "SCHEDULE_D"] as const),
  taxYear: z.string().min(4, "Please enter a valid tax year"),
})

export type FormValues = z.infer<typeof formSchema>

export interface PropertyData {
  address: string
  purchasePrice: number
  purchaseDate: string
  currentValue: number
}

export interface ProjectData {
  name: string
  cost: number
  date: string
}

export interface TaxFormData {
  taxYear: string
  propertyInfo: PropertyData
  improvements: ProjectData[]
}