
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const taxFilingStatuses = [
  "Single",
  "Married Filing Jointly",
  "Married Filing Separately",
  "Head of Household",
  "Qualifying Widow(er)"
] as const

interface TaxFilingStatusFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaxFilingStatusField({ value, onChange }: TaxFilingStatusFieldProps) {
  return (
    <FormItem>
      <FormLabel>Tax Filing Status</FormLabel>
      <FormControl>
        <Select onValueChange={onChange} value={value}>
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
  )
}

export { taxFilingStatuses }
