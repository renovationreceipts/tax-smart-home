import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import type { ProjectFormValues } from "../ProjectFormTypes"

interface ProjectNameFieldProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectNameField({ form }: ProjectNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project Name</FormLabel>
          <FormControl>
            <Input placeholder="Kitchen Renovation" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}