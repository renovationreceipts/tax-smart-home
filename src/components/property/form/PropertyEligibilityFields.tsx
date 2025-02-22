
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "./types"

interface PropertyEligibilityFieldsProps {
  form: UseFormReturn<PropertyFormValues>
}

export function PropertyEligibilityFields({ form }: PropertyEligibilityFieldsProps) {
  return (
    <div>
      <FormField
        control={form.control}
        name="livedInProperty2of5Years"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Lived in property 2 of 5 years</FormLabel>
              <FormDescription>
                Have you lived in this property for at least 2 of the last 5
                years?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
