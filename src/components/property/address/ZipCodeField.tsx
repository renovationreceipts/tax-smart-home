
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "../PropertyFormTypes"

interface ZipCodeFieldProps {
  form: UseFormReturn<PropertyFormValues>
}

export function ZipCodeField({ form }: ZipCodeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="zipCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>ZIP Code</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter ZIP code" 
              maxLength={5}
              {...field}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                field.onChange(value)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
