
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "../PropertyFormTypes"

interface StreetAddressFieldProps {
  form: UseFormReturn<PropertyFormValues>
}

export function StreetAddressField({ form }: StreetAddressFieldProps) {
  return (
    <FormField
      control={form.control}
      name="streetAddress"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Street Address</FormLabel>
          <FormControl>
            <Input placeholder="Enter street address" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
