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
    const numericValue = value.replace(/[^0-9]/g, "")
    if (!numericValue) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(numericValue) / 100)
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
              placeholder="$0.00"
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