
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { usePercentageInput } from "@/hooks/usePercentageInput"

interface PercentageFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function PercentageField({ value, onChange }: PercentageFieldProps) {
  const { inputRef, displayValue, handleChange } = usePercentageInput({
    value,
    onChange,
    maxDecimals: 2
  })

  return (
    <FormItem>
      <FormLabel>Tax Rate</FormLabel>
      <FormControl>
        <Input
          ref={inputRef}
          placeholder="0%"
          value={displayValue}
          onChange={handleChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
