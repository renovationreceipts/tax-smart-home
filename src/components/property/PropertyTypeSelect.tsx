import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "./PropertyFormTypes"

interface PropertyTypeSelectProps {
  form: UseFormReturn<PropertyFormValues>
}

export function PropertyTypeSelect({ form }: PropertyTypeSelectProps) {
  console.log("Current property type value:", form.getValues("propertyType"))
  
  return (
    <FormField
      control={form.control}
      name="propertyType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Property Type</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="PRIMARY_HOME">Primary Home</SelectItem>
              <SelectItem value="SECOND_HOME">Second Home</SelectItem>
              <SelectItem value="RENTAL">Rental Property</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}