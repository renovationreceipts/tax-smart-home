
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

        // Convert the tax rate to decimal (e.g., 15% -> 0.15)
        setUserTaxRate(profile?.tax_rate ? profile.tax_rate / 100 : 0)
      } catch (error) {
        console.error('Error fetching tax rate:', error)
      }
    }

    fetchUserTaxRate()
  }, [])

  const totalProjectCosts = projects.reduce((sum, project) => sum + (project.cost || 0), 0)
  const adjustedCostBasis = property ? property.purchase_price + totalProjectCosts : 0
  const totalCapitalGains = property ? property.current_value - adjustedCostBasis : 0
  const taxableGainWithBasis = property ? property.current_value - adjustedCostBasis : 0
  const taxableGainWithoutBasis = property ? property.current_value - (property.purchase_price || 0) : 0
  const taxSavings = taxableGainWithoutBasis - taxableGainWithBasis
  const estimatedTaxSavings = taxSavings * (userTaxRate || 0)

  return {
    userTaxRate,
    totalProjectCosts: totalCapitalGains,
    newCostBasis: totalProjectCosts, // Changed to return totalProjectCosts instead
    taxableGainWithBasis,
    taxableGainWithoutBasis,
    taxSavings,
    estimatedTaxSavings,
    adjustedCostBasis,
  }
}
