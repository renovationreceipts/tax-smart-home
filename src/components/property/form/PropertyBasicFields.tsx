
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "./types"

interface PropertyBasicFieldsProps {
  form: UseFormReturn<PropertyFormValues>
}

export function PropertyBasicFields({ form }: PropertyBasicFieldsProps) {
  return (
    <div className="space-y-6 pt-6">
      <FormField
        control={form.control}
        name="propertyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="PRIMARY_HOME">Primary Home</SelectItem>
                <SelectItem value="SECOND_HOME">Second Home</SelectItem>
                <SelectItem value="RENTAL">Rental</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Main House" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
