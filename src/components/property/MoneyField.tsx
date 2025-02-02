import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "./PropertyFormTypes"

interface MoneyFieldProps {
  form: UseFormReturn<PropertyFormValues>
  name: "purchasePrice" | "currentValue"
  label: string
}

export function MoneyField({ form, name, label }: MoneyFieldProps) {
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