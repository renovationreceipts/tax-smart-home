import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import type { ProjectFormValues } from "./ProjectFormTypes"

interface ProjectFileFieldsProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectFileFields({ form }: ProjectFileFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="beforePhotos"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Before Photos (Optional)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    onChange(files)
                  }
                }}
                {...field}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="afterPhotos"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>After Photos (Optional)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    onChange(files)
                  }
                }}
                {...field}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="receipts"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Receipts (Optional)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    onChange(files)
                  }
                }}
                {...field}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}