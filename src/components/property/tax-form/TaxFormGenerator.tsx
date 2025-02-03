import { FileText } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { TaxFormSelect } from "./TaxFormSelect"
import { formSchema, type FormValues } from "./types"
import { useTaxFormSubmit } from "./useTaxFormSubmit"

interface TaxFormGeneratorProps {
  property: any
  projects: any[]
}

export function TaxFormGenerator({ property, projects }: TaxFormGeneratorProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formType: "8949",
      taxYear: new Date().getFullYear().toString(),
    },
  })

  const { onSubmit, isGenerating } = useTaxFormSubmit({ property, projects })

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Generate Tax Forms</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TaxFormSelect form={form} />
          
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