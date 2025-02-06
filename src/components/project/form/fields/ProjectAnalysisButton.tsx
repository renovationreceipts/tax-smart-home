import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Lightbulb } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

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
  const [credits, setCredits] = useState<{ used: number, limit: number } | null>(null)
  const { toast } = useToast()

  // Fetch user credits on component mount
  useEffect(() => {
    async function fetchCredits() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_used, credits_limit')
        .eq('credit_type', 'irs_gpt')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching credits:', error)
        return
      }

      setCredits(data ? { used: data.credits_used, limit: data.credits_limit } : null)
    }

    fetchCredits()
  }, [])

  const updateCreditsUsed = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_credits')
      .update({ credits_used: (credits?.used || 0) + 1 })
      .eq('credit_type', 'irs_gpt')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating credits:', error)
    } else {
      setCredits(prev => prev ? { ...prev, used: prev.used + 1 } : null)
    }
  }

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
        description: "You've used all your IRS-GPT credits. Please try again later.",
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
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={analyzeDescription}
        disabled={isButtonDisabled}
        className="text-sm"
      >
        {isAnalyzing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Lightbulb className="mr-2 h-4 w-4" />
        )}
        Does this Qualify? Ask IRS-GPT!
      </Button>
      {credits && (
        <span className="text-sm text-gray-500">
          {credits.used}/{credits.limit} credits used
        </span>
      )}
    </div>
  )
}