
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface TaxCalculationsProps {
  property: any
  projects: any[]
}

export function useTaxCalculations({ property, projects }: TaxCalculationsProps) {
  const [userTaxRate, setUserTaxRate] = useState<number | null>(null)
  const [userFilingStatus, setUserFilingStatus] = useState<string>("Single")

  useEffect(() => {
    async function fetchUserTaxInfo() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('tax_rate, tax_filing_status')
          .eq('id', user.id)
          .single()

        // Convert the tax rate to decimal (e.g., 15% -> 0.15)
        setUserTaxRate(profile?.tax_rate ? profile.tax_rate / 100 : 0)
        setUserFilingStatus(profile?.tax_filing_status || "Single")
      } catch (error) {
        console.error('Error fetching tax rate:', error)
      }
    }

    fetchUserTaxInfo()
  }, [])

  const calculateExemptionAmount = (filingStatus: string, livedIn2of5: boolean | null): number => {
    if (!livedIn2of5) return 0

    switch (filingStatus) {
      case "Married Filing Jointly":
      case "Qualifying Widow(er)":
        return 500000
      case "Single":
      case "Married Filing Separately":
      case "Head of Household":
        return 250000
      default:
        return 250000 // Default to single exemption amount
    }
  }

  const totalProjectCosts = projects.reduce((sum, project) => sum + (project.cost || 0), 0)
  const adjustedCostBasis = property ? property.purchase_price + totalProjectCosts : 0
  const totalCapitalGains = property ? property.current_value - adjustedCostBasis : 0
  const taxableGainWithBasis = property ? property.current_value - adjustedCostBasis : 0
  const taxableGainWithoutBasis = property ? property.current_value - (property.purchase_price || 0) : 0

  const exemptionAmount = calculateExemptionAmount(
    userFilingStatus,
    property?.lived_in_property_2_of_5_years
  )

  const taxSavings = exemptionAmount
  const estimatedTaxSavings = taxSavings * (userTaxRate || 0)

  return {
    userTaxRate,
    totalProjectCosts: totalCapitalGains,
    newCostBasis: totalProjectCosts,
    taxableGainWithBasis,
    taxableGainWithoutBasis,
    taxSavings,
    estimatedTaxSavings,
    adjustedCostBasis,
  }
}
