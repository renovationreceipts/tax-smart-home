
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Lightbulb } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useIRSCredits } from "@/hooks/useIRSCredits"
import { CreditsDisplay } from "./CreditsDisplay"

interface ProjectAnalysisButtonProps {
  description: string
  onAnalysisComplete: (analysis: string) => void
  isDisabled?: boolean
}

export function ProjectAnalysisButton({ 
  description, 
  onAnalysisComplete,
  isDisabled = false
}: ProjectAnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { credits, updateCreditsUsed } = useIRSCredits()
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

    if (credits && credits.used >= credits.limit) {
      toast({
        title: "Credit Limit Reached",
        description: "You've used all your IRS-GPT credits.",
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
            description: "The analysis service is temporarily busy. Please wait a moment and try again.",
            variant: "destructive",
          })
          return
        }
        throw error
      }

      await updateCreditsUsed()
      onAnalysisComplete(data.analysis)
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your project description for cost basis eligibility.",
      })
    } catch (error) {
      console.error('Error analyzing project:', error)
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the project description. Please try again in a few moments.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const isButtonDisabled = isAnalyzing || !description.trim() || isDisabled || 
    (credits && credits.used >= credits.limit)

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:justify-end">
      {credits && (
        <div className="order-2 sm:order-1">
          <CreditsDisplay used={credits.used} limit={credits.limit} />
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={analyzeDescription}
        disabled={isButtonDisabled}
        className="text-sm w-full order-1 sm:order-2"
      >
        {isAnalyzing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Lightbulb className="mr-2 h-4 w-4" />
        )}
        Does this Qualify? Ask IRS-GPT!
      </Button>
    </div>
  )
}
