import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "./PropertyFormTypes"

interface PropertyNameFieldProps {
  form: UseFormReturn<PropertyFormValues>
}

export function PropertyNameField({ form }: PropertyNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Property Name/Description</FormLabel>
          <FormControl>
            <Input placeholder="e.g., Beach House" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}