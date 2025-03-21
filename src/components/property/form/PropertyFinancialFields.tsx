
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "./types"
import { MoneyField } from "@/components/property/MoneyField"

interface PropertyFinancialFieldsProps {
  form: UseFormReturn<PropertyFormValues>
}

export function PropertyFinancialFields({ form }: PropertyFinancialFieldsProps) {
  return (
    <div className="space-y-6">
      <MoneyField
        form={form}
        name="purchasePrice"
        label="Purchase Price"
      />

      <FormField
        control={form.control}
        name="purchaseDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Purchase Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <MoneyField
        form={form}
        name="currentValue"
        label="Current Value"
      />
    </div>
  )
}
