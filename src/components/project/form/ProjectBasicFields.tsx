import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MoneyField } from "@/components/property/MoneyField"
import { UseFormReturn } from "react-hook-form"
import type { ProjectFormValues } from "./ProjectFormTypes"

interface ProjectBasicFieldsProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectBasicFields({ form }: ProjectBasicFieldsProps) {
  return (
    <>
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

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your project..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <MoneyField
        form={form}
        name="cost"
        label="Project Cost"
      />
    </>
  )
}