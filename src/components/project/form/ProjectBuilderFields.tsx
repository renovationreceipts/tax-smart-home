import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import type { ProjectFormValues } from "./ProjectFormTypes"

interface ProjectBuilderFieldsProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectBuilderFields({ form }: ProjectBuilderFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="builder_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Builder Name (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Builder or Contractor Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="builder_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Builder Website (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}