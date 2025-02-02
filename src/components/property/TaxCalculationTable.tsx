import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table"
import { TaxTableRow } from "./TaxTableRow"
import { useTaxCalculations } from "@/hooks/useTaxCalculations"

interface TaxCalculationTableProps {
  property: any
  projects: any[]
}

export function TaxCalculationTable({ property, projects }: TaxCalculationTableProps) {
  const {
    userTaxRate,
    totalProjectCosts,
    newCostBasis,
    taxableGainWithBasis,
    taxableGainWithoutBasis,
    taxSavings,
    estimatedTaxSavings,
  } = useTaxCalculations({ property, projects })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TaxTableRow 
          label="Current Home Value"
          value={property?.current_value}
        />
        <TaxTableRow 
          label="Purchase Price"
          value={property?.purchase_price}
        />
        <TaxTableRow 
          label="Basis Adjustments (Total Project Costs)"
          value={totalProjectCosts}
        />
        <TaxTableRow 
          label="New Cost Basis"
          value={newCostBasis}
        />
        <TaxTableRow 
          label="Taxable Gain With New Cost Basis"
          value={taxableGainWithBasis}
        />
        <TaxTableRow 
          label="Taxable Gain Without New Cost Basis"
          value={taxableGainWithoutBasis}
        />
        <TaxTableRow 
          label="Tracking Improvements Reduced Your Taxable Capital Gain By"
          value={taxSavings}
        />
        <TaxTableRow 
          label={`Based on ${userTaxRate !== null ? `${(userTaxRate * 100).toFixed(1)}%` : '0%'} Tax Rate This Saved You`}
          value={estimatedTaxSavings}
          isHighlighted
        />
      </TableBody>
    </Table>
  )
}