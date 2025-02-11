
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn, Path } from "react-hook-form"

// Make this type generic to work with any form values
interface MoneyFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
}

export function MoneyField<T extends Record<string, any>>({ 
  form, 
  name, 
  label 
}: MoneyFieldProps<T>) {
  function formatCurrency(value: string) {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "")
    if (!numericValue) return ""
    
    // Format as whole dollars (no cents)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(numericValue))
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder="$0"
              inputMode="numeric"
              {...field}
              onChange={(e) => {
                const formatted = formatCurrency(e.target.value)
                e.target.value = formatted
                onChange(e)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
