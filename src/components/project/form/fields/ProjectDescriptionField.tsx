import { useState, useEffect } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { ProjectAnalysisButton } from "./ProjectAnalysisButton"
import type { ProjectFormValues } from "../ProjectFormTypes"

interface ProjectDescriptionFieldProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectDescriptionField({ form }: ProjectDescriptionFieldProps) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [lastAnalyzedText, setLastAnalyzedText] = useState<string>("")
  const currentDescription = form.watch("description") || ""

  // Reset the analyzed state when description changes
  useEffect(() => {
    if (currentDescription !== lastAnalyzedText) {
      setLastAnalyzedText("")
    }
  }, [currentDescription, lastAnalyzedText])

  const handleAnalysisComplete = (analysisText: string) => {
    setAnalysis(analysisText)
    setLastAnalyzedText(currentDescription)
  }

  const isAnalysisDisabled = currentDescription === lastAnalyzedText && analysis !== null

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center justify-between">
            <span>Description</span>
            <ProjectAnalysisButton 
              description={field.value || ""} 
              onAnalysisComplete={handleAnalysisComplete}
              isDisabled={isAnalysisDisabled}
            />
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
  )
}