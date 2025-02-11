
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "../PropertyFormTypes"

interface CityFieldProps {
  form: UseFormReturn<PropertyFormValues>
}

export function CityField({ form }: CityFieldProps) {
  return (
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>City</FormLabel>
          <FormControl>
            <Input placeholder="Enter city" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
