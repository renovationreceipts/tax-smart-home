
import { supabase } from "@/integrations/supabase/client"

interface ProjectAnalysis {
  costBasis: { qualifies: boolean; analysis: string }
  taxCredits: { qualifies: boolean; analysis: string }
  insuranceReduction: { qualifies: boolean; analysis: string }
}

export async function analyzeProject(description: string): Promise<ProjectAnalysis> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-project', {
      body: { description }
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error analyzing project:', error)
    return {
      costBasis: { qualifies: false, analysis: 'Analysis failed' },
      taxCredits: { qualifies: false, analysis: 'Analysis failed' },
      insuranceReduction: { qualifies: false, analysis: 'Analysis failed' }
    }
  }
}
