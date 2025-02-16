
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
    userTaxRate,
    exemptionAmount,
    finalTaxableGain,
  } = useTaxCalculations({ property, projects })

  const estimatedTax = finalTaxableGain * userTaxRate

  return (
    <div className="space-y-8">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-gray-500">Category</TableHead>
            <TableHead className="text-right text-gray-500">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TaxTableRow
            label="Current Home Value"
            value={property.current_value}
          />
          <TaxTableRow
            label="Your Adjusted Cost Basis (Purchase Price + Tracked Improvements)"
            value={adjustedCostBasis}
            className="border-b border-gray-200"
          />
          <TaxTableRow
            label="Total Capital Gains Before Exemptions"
            value={taxableGainWithBasis}
          />
          <TaxTableRow
            label="Tracked Home Improvements Reduced Your Reported Gain By"
            value={totalProjectCosts}
            className="text-green-600 font-medium"
          />
          <TaxTableRow
            label="Without Tracking, Your Reported Gain Would Have Been"
            value={taxableGainWithoutBasis}
          />
          <TaxTableRow
            label="Eligible Federal Capital Gains Exemption Applied (Based on filing status)"
            value={exemptionAmount}
          />
          <TaxTableRow
            label="Final Federal Taxable Gain After Exemption"
            value={finalTaxableGain}
            className="font-medium"
          />
          <TaxTableRow
            label="Using your capital gains tax rate, your Federal cap gains tax would be"
            value={estimatedTax}
            className="font-medium"
          />
        </TableBody>
      </Table>

      <div className="text-sm text-gray-600">
        Update your tax filing status and cap gains tax rate in your{" "}
        <a href="/profile" className="text-blue-600 hover:underline">
          Profile
        </a>
        .
      </div>
    </div>
  )
}
