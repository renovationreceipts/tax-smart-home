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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const totalProjectCosts = projects.reduce((sum, project) => sum + project.cost, 0)
  const newCostBasis = property ? property.purchase_price + totalProjectCosts : totalProjectCosts
  const taxableGainWithBasis = property ? property.current_value - newCostBasis : 0
  const taxableGainWithoutBasis = property ? property.current_value - (property.purchase_price || 0) : 0
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
          <TableCell>{property ? formatCurrency(property.current_value) : formatCurrency(0)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Purchase Price</TableCell>
          <TableCell>{property ? formatCurrency(property.purchase_price) : formatCurrency(0)}</TableCell>
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