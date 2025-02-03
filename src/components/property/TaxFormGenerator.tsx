import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"

const formSchema = z.object({
  formType: z.enum(["8949", "SCHEDULE_D"], {
    required_error: "Please select a form type",
  }),
  taxYear: z.string().min(4, "Please enter a valid tax year"),
})

interface TaxFormGeneratorProps {
  property: any
  projects: any[]
}

export function TaxFormGenerator({ property, projects }: TaxFormGeneratorProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formType: "8949",
      taxYear: new Date().getFullYear().toString(),
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsGenerating(true)
      console.log("Generating tax form with values:", values)

      // Calculate form data based on property and projects
      const formData = {
        propertyInfo: {
          address: property.address,
          purchasePrice: property.purchase_price,
          purchaseDate: property.purchase_date,
          currentValue: property.current_value,
        },
        improvements: projects.map(project => ({
          name: project.name,
          cost: project.cost,
          date: project.completion_date,
        })),
      }

      // Store form data in Supabase
      const { error } = await supabase
        .from('tax_forms')
        .insert({
          property_id: property.id,
          form_type: values.formType,
          tax_year: parseInt(values.taxYear),
          data: formData,
        })

      if (error) throw error

      toast({
        title: "Success",
        description: `${values.formType} form for tax year ${values.taxYear} has been generated.`,
      })

      // TODO: Implement PDF generation and download
      console.log("Form data stored:", formData)

    } catch (error) {
      console.error("Error generating tax form:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate tax form. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Generate Tax Forms</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <Button 
            type="submit" 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Tax Form"}
          </Button>
        </form>
      </Form>
    </div>
  )
}