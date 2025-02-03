import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "./types"

interface TaxFormSelectProps {
  form: UseFormReturn<FormValues>
}

export function TaxFormSelect({ form }: TaxFormSelectProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="formType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Form Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a form type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="8949">Form 8949 (Sales and Other Dispositions)</SelectItem>
                <SelectItem value="SCHEDULE_D">Schedule D (Capital Gains and Losses)</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="taxYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tax Year</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tax year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}