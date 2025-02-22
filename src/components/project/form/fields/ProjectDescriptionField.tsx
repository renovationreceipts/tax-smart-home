
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import type { ProjectFormValues } from "../ProjectFormTypes"

interface ProjectDescriptionFieldProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectDescriptionField({ form }: ProjectDescriptionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Describe your project in detail... (minimum 15 characters)"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            For AI Analysis to work properly, description must be at least 15 characters long.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
