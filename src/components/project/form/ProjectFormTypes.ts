
import { z } from "zod"

// Helper function to check for repetitive characters
const hasRepetitiveChars = (str: string) => /(.)\1{2,}/.test(str);

// Helper function to check for common test inputs
const containsTestInputs = (str: string) => {
  const testInputs = ['test', '123', 'abc', 'xyz'];
  return testInputs.some(test => str.toLowerCase().includes(test));
};

export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string()
    .min(15, "Description must be at least 15 characters long")
    .refine(
      (value) => {
        const words = value.trim().split(/\s+/);
        return words.length >= 2;
      },
      "Description must contain at least 2 words"
    )
    .refine(
      (value) => !hasRepetitiveChars(value),
      "Please avoid repetitive characters in your description"
    )
    .refine(
      (value) => !containsTestInputs(value),
      "Please provide a meaningful description of your project"
    ),
  cost: z.string().min(1, "Project cost is required"),
  completion_date: z.date({
    required_error: "Completion date is required",
  }),
  builder_name: z.string().optional(),
  builder_url: z.string().optional().or(z.literal("")),
  beforePhotos: z.instanceof(FileList).nullable().optional(),
  afterPhotos: z.instanceof(FileList).nullable().optional(),
  receipts: z.instanceof(FileList).nullable().optional(),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>
