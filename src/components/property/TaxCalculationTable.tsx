import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  if (!property) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const totalProjectCosts = projects.reduce((sum, project) => sum + project.cost, 0)
  const newCostBasis = property.purchase_price + totalProjectCosts
  const taxableGainWithBasis = property.current_value - newCostBasis
  const taxableGainWithoutBasis = property.current_value - property.purchase_price
  const taxSavings = taxableGainWithoutBasis - taxableGainWithBasis
  const assumedTaxRate = 0.20 // 20% capital gains tax rate
  const estimatedTaxSavings = taxSavings * assumedTaxRate

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
          <TableCell>{formatCurrency(property.current_value)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Purchase Price</TableCell>
          <TableCell>{formatCurrency(property.purchase_price)}</TableCell>
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
          <TableCell className="font-medium text-green-600">Based on 20% Tax Rate This Saved You</TableCell>
          <TableCell className="text-green-600">{formatCurrency(estimatedTaxSavings)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}