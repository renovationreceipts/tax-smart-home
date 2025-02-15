
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TaxTableRow } from "./TaxTableRow"
import { formatCurrency } from "@/lib/utils"
import { useTaxCalculations } from "@/hooks/useTaxCalculations"
import type { Project } from "@/hooks/useProjects"

interface TaxCalculationTableProps {
  property: any
  projects: Project[]
  onProjectClick?: (project: Project) => void
}

export function TaxCalculationTable({ property, projects, onProjectClick }: TaxCalculationTableProps) {
  const {
    totalProjectCosts,
    adjustedCostBasis,
    taxableGainWithBasis,
    taxableGainWithoutBasis,
  } = useTaxCalculations({ property, projects })

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Tax Impact</h3>
        <Table>
          <TableBody>
            <TaxTableRow
              label="Original Purchase Price"
              value={property.purchase_price}
            />
            <TaxTableRow
              label="Total Cost Basis Improvements"
              value={totalProjectCosts}
              className="border-t"
            />
            <TaxTableRow
              label="New Cost Basis"
              value={adjustedCostBasis}
              isTotal
            />
            <TaxTableRow
              label="Current Value"
              value={property.current_value}
              className="border-t"
            />
            <TaxTableRow
              label="Taxable Gain (with improvements)"
              value={taxableGainWithBasis}
              isHighlighted
            />
            <TaxTableRow
              label="Taxable Gain (without improvements)"
              value={taxableGainWithoutBasis}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
