import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/integrations/supabase/client"
import type { Project } from "@/hooks/useProjects"

interface Property {
  id: string
  name: string
  purchase_price: number
  current_value: number
}

interface TaxCalculationTableProps {
  property: Property | undefined
  projects: Project[]
}

export function TaxCalculationTable({ property, projects }: TaxCalculationTableProps) {
  const [userTaxRate, setUserTaxRate] = useState<number | null>(null)

  useEffect(() => {
    const fetchUserTaxRate = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tax_rate')
          .eq('id', user.id)
          .single()
        
        if (profile?.tax_rate) {
          setUserTaxRate(profile.tax_rate / 100) // Convert percentage to decimal
        }
      }
    }

    fetchUserTaxRate()
  }, [])

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalProjectCosts = property ? projects.reduce((sum, project) => sum + project.cost, 0) : null
  const newCostBasis = property && totalProjectCosts !== null ? property.purchase_price + totalProjectCosts : null
  const taxableGainWithBasis = property ? property.current_value - (newCostBasis || 0) : null
  const taxableGainWithoutBasis = property ? property.current_value - property.purchase_price : null
  const taxSavings = taxableGainWithBasis !== null && taxableGainWithoutBasis !== null 
    ? taxableGainWithoutBasis - taxableGainWithBasis 
    : null
  const estimatedTaxSavings = taxSavings !== null && userTaxRate !== null ? taxSavings * userTaxRate : null

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Current Home Value</TableCell>
          <TableCell>{property ? formatCurrency(property.current_value) : "-"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Purchase Price</TableCell>
          <TableCell>{property ? formatCurrency(property.purchase_price) : "-"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Basis Adjustments (Total Project Costs)</TableCell>
          <TableCell>{formatCurrency(totalProjectCosts)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">New Cost Basis</TableCell>
          <TableCell>{formatCurrency(newCostBasis)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Taxable Gain With New Cost Basis</TableCell>
          <TableCell>{formatCurrency(taxableGainWithBasis)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Taxable Gain Without New Cost Basis</TableCell>
          <TableCell>{formatCurrency(taxableGainWithoutBasis)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Tracking Improvements Reduced Your Taxable Capital Gain By</TableCell>
          <TableCell>{formatCurrency(taxSavings)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium text-green-600">
            Based on {userTaxRate !== null ? `${(userTaxRate * 100).toFixed(1)}%` : '0%'} Tax Rate This Saved You
          </TableCell>
          <TableCell className="text-green-600">{formatCurrency(estimatedTaxSavings)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}