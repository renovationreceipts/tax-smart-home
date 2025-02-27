import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface PercentageFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function PercentageField({ value, onChange }: PercentageFieldProps) {
  function formatPercentage(value: string) {
    // Remove any existing % symbol first
    value = value.replace(/%/g, '')
    
    // If empty after removing %, return empty string
    if (!value) return ""
    
    // Only allow one decimal point
    const parts = value.split('.')
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('')
    }
    
    // Remove any non-numeric characters except decimal point
    value = value.replace(/[^0-9.]/g, '')
    
    // If it's just a decimal point, allow it
    if (value === '.') return '0.'
    
    // If it ends with a decimal point, preserve it
    if (value.endsWith('.')) {
      return `${value}%`
    }
    
    // If we have a valid number
    const number = parseFloat(value)
    if (isNaN(number)) return ""
    
    // If there's a decimal point, ensure we show decimal places
    if (value.includes('.')) {
      const [whole, decimal] = value.split('.')
      // If decimal part exists, limit to 2 places
      if (decimal) {
        return `${whole}.${decimal.slice(0, 2)}%`
      }
      // If just ended with decimal point, keep it
      return `${whole}.%`
    }
    
    return `${number}%`
  }

  return (
    <FormItem>
      <FormLabel>Tax Rate</FormLabel>
      <FormControl>
        <Input
          placeholder="0%"
          value={value ? `${value}%` : ""}
          onChange={(e) => {
            const formatted = formatPercentage(e.target.value)
            // Only convert to number if we have a complete decimal number
            const shouldParseNumber = !formatted.endsWith('.%')
            const numericValue = shouldParseNumber ? parseFloat(formatted) : value
            onChange(isNaN(numericValue) ? 0 : numericValue)
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
