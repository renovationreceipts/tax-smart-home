import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "./PropertyFormTypes"

interface PropertyAddressFieldProps {
  form: UseFormReturn<PropertyFormValues>
}

export function PropertyAddressField({ form }: PropertyAddressFieldProps) {
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Property Address</FormLabel>
          <FormControl>
            <Input placeholder="Enter full address" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}