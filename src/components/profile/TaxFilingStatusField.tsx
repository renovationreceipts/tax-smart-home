
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"

const taxFilingStatuses = [
  "Single",
  "Married Filing Jointly",
  "Married Filing Separately",
  "Head of Household",
  "Qualifying Widow(er)"
] as const

interface TaxFilingStatusFieldProps {
  form: UseFormReturn<any>
}

export function TaxFilingStatusField({ form }: TaxFilingStatusFieldProps) {
  return (
    <FormField
      control={form.control}
      name="tax_filing_status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tax Filing Status</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select your filing status" />
              </SelectTrigger>
              <SelectContent>
                {taxFilingStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { taxFilingStatuses }
