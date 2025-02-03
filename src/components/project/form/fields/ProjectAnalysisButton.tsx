import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Lightbulb } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ProjectAnalysisButtonProps {
  description: string
  onAnalysisComplete: (analysis: string) => void
}

export function ProjectAnalysisButton({ 
  description, 
  onAnalysisComplete 
}: ProjectAnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const analyzeDescription = async () => {
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

      onAnalysisComplete(data.analysis)
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
  )
}