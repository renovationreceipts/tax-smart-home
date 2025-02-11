
import { z } from "zod"

export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  cost: z.string().min(1, "Project cost is required"),
  completion_date: z.date({
    required_error: "Completion date is required",
  }),
  builder_name: z.string().optional(),
  builder_url: z.string().url().optional().or(z.literal("")),
  beforePhotos: z.instanceof(FileList).nullable().optional(),
  afterPhotos: z.instanceof(FileList).nullable().optional(),
  receipts: z.instanceof(FileList).nullable().optional(),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>
