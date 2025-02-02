import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"

interface PercentageFieldProps {
  form: UseFormReturn<any>
  name: string
  label: string
}

export function PercentageField({ form, name, label }: PercentageFieldProps) {
  function formatPercentage(value: string) {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, "")
    if (!numericValue) return ""
    
    // Format as percentage with up to 2 decimal places
    const number = parseFloat(numericValue)
    if (isNaN(number)) return ""
    return `${number}%`
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder="0%"
              {...field}
              value={value ? `${value}%` : ""}
              onChange={(e) => {
                const formatted = formatPercentage(e.target.value)
                const numericValue = parseFloat(formatted)
                onChange(isNaN(numericValue) ? "" : numericValue)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}