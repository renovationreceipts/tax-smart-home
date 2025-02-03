import { useState } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MoneyField } from "@/components/property/MoneyField"
import { UseFormReturn } from "react-hook-form"
import { Loader2, Lightbulb } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { ProjectFormValues } from "./ProjectFormTypes"

interface ProjectBasicFieldsProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectBasicFields({ form }: ProjectBasicFieldsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const { toast } = useToast()

  const analyzeDescription = async () => {
    const description = form.getValues("description")
    
    if (!description) {
      toast({
        title: "Missing Description",
        description: "Please enter a project description first.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const { data, error } = await supabase.functions.invoke('analyze-project', {
        body: { description }
      })

      if (error) {
        if (error.status === 429) {
          toast({
            title: "Service Busy",
            description: "The analysis service is temporarily unavailable. Please try again in a few moments.",
            variant: "destructive",
          })
          return
        }
        throw error
      }

      setAnalysis(data.analysis)
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your project description for cost basis eligibility.",
      })
    } catch (error) {
      console.error('Error analyzing project:', error)
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the project description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input placeholder="Kitchen Renovation" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              <span>Description</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={analyzeDescription}
                disabled={isAnalyzing}
                className="text-sm"
              >
                {isAnalyzing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="mr-2 h-4 w-4" />
                )}
                Analyze for Cost Basis
              </Button>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your project..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
            {analysis && (
              <div className="mt-2 text-sm p-3 bg-muted rounded-md">
                {analysis}
              </div>
            )}
          </FormItem>
        )}
      />

      <MoneyField
        form={form}
        name="cost"
        label="Project Cost"
      />
    </>
  )
}