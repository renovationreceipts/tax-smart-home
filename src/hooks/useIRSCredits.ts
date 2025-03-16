
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

export function useIRSCredits() {
  const [credits, setCredits] = useState<{ used: number, limit: number } | null>(null)

  useEffect(() => {
    fetchCredits()
  }, [])

  const fetchCredits = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('user_credits')
      .select('credits_used, credits_limit')
      .eq('credit_type', 'irs_gpt')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching credits:', error)
      return
    }

    if (!data) {
      const { data: newCredits, error: insertError } = await supabase
        .from('user_credits')
        .insert({
          user_id: user.id,
          credit_type: 'irs_gpt',
          credits_used: 0,
          credits_limit: 10
        })
        .select('credits_used, credits_limit')
        .single()

      if (insertError) {
        console.error('Error initializing credits:', insertError)
        return
      }

      setCredits({ 
        used: newCredits.credits_used, 
        limit: newCredits.credits_limit 
      })
    } else {
      setCredits({ 
        used: data.credits_used, 
        limit: data.credits_limit 
      })
    }
  }

  // This still updates the database for tracking purposes, but doesn't affect the UI functionality
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

  // We're still returning the credits to be able to display them, but won't use them to limit
  return { credits, updateCreditsUsed }
}
