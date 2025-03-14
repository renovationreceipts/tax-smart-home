
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { usePercentageInput } from "@/hooks/usePercentageInput"

interface GrowthRateFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function GrowthRateField({ value, onChange }: GrowthRateFieldProps) {
  const { inputRef, displayValue, handleChange } = usePercentageInput({
    value,
    onChange,
    maxDecimals: 2
  })

  return (
    <FormItem>
      <FormLabel>Home Value Growth Rate</FormLabel>
      <FormControl>
        <Input
          ref={inputRef}
          placeholder="4.92%"
          value={displayValue}
          onChange={handleChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
