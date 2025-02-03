import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { generatePDF } from "./pdfGenerator"
import type { FormValues, TaxFormData } from "./types"

interface UseTaxFormSubmitProps {
  property: any
  projects: any[]
}

export function useTaxFormSubmit({ property, projects }: UseTaxFormSubmitProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const onSubmit = async (values: FormValues) => {
    try {
      setIsGenerating(true)
      console.log("Generating tax form with values:", values)

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      // Calculate form data based on property and projects
      const formData: TaxFormData = {
        taxYear: values.taxYear,
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
          user_id: user.id,
          property_id: property.id,
          form_type: values.formType,
          tax_year: parseInt(values.taxYear),
          data: formData as unknown as Json, // Type assertion to match Supabase's Json type
        })

      if (error) throw error

      // Generate and download PDF
      generatePDF(values.formType, formData)

      toast({
        title: "Success",
        description: `${values.formType} form for tax year ${values.taxYear} has been generated.`,
      })

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

  return {
    onSubmit,
    isGenerating,
  }
}