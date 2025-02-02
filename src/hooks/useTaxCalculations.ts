import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface TaxCalculationsProps {
  property: any
  projects: any[]
}

export function useTaxCalculations({ property, projects }: TaxCalculationsProps) {
  const [userTaxRate, setUserTaxRate] = useState<number | null>(null)

  useEffect(() => {
    async function fetchUserTaxRate() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('tax_rate')
          .eq('id', user.id)
          .single()

        setUserTaxRate(profile?.tax_rate || 0)
      } catch (error) {
        console.error('Error fetching tax rate:', error)
      }
    }

    fetchUserTaxRate()
  }, [])

  const totalProjectCosts = projects.reduce((sum, project) => sum + (project.cost || 0), 0)
  const newCostBasis = property ? property.purchase_price + totalProjectCosts : totalProjectCosts
  const taxableGainWithBasis = property ? property.current_value - newCostBasis : 0
  const taxableGainWithoutBasis = property ? property.current_value - (property.purchase_price || 0) : 0
  const taxSavings = taxableGainWithoutBasis - taxableGainWithBasis
  const estimatedTaxSavings = taxSavings * (userTaxRate || 0)

  return {
    userTaxRate,
    totalProjectCosts,
    newCostBasis,
    taxableGainWithBasis,
    taxableGainWithoutBasis,
    taxSavings,
    estimatedTaxSavings,
  }
}