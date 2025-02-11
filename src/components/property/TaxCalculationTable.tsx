
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table"
import { TaxTableRow } from "./TaxTableRow"
import { useTaxCalculations } from "@/hooks/useTaxCalculations"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

interface TaxCalculationTableProps {
  property: any
  projects: any[]
}

export function TaxCalculationTable({ property, projects }: TaxCalculationTableProps) {
  const navigate = useNavigate()
  const {
    userTaxRate,
    totalProjectCosts,
    newCostBasis,
    taxableGainWithBasis,
    taxableGainWithoutBasis,
    taxSavings,
    estimatedTaxSavings,
    adjustedCostBasis,
  } = useTaxCalculations({ property, projects })

  return (
    <div className="space-y-6">
      {/* First Table: Cost Basis Calculation */}
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
            label="Your Adjusted Cost Basis (Purchase Price + Tracked Improvements)"
            value={adjustedCostBasis}
          />
          <TaxTableRow 
            label="Total Capital Gains Before Exemptions"
            value={totalProjectCosts}
          />
          <TaxTableRow 
            label="Tracked Home Improvements Reduced Your Reported Gain By"
            value={newCostBasis}
          />
        </TableBody>
      </Table>

      <Separator className="my-4 bg-black" />

      {/* Second Table: Tax Calculations */}
      <Table>
        <TableBody>
          <TaxTableRow 
            label="Without Tracking, Your Reported Gain Would Have Been"
            value={taxableGainWithBasis}
          />
          <TaxTableRow 
            label="📉 Eligible Federal Capital Gains Exemption Applied (Based on filing status)"
            value={taxSavings}
          />
          <TaxTableRow 
            label={`Based on ${userTaxRate !== null ? `${(userTaxRate * 100).toFixed(1)}%` : '0%'} Tax Rate This Saved You`}
            value={estimatedTaxSavings}
            isHighlighted
          />
        </TableBody>
      </Table>

      <div className="bg-gray-50 border rounded-lg px-4 py-3 text-sm text-gray-600">
        <div className="flex items-center">
          Update your personalized capital gains tax rate in your{" "}
          <button 
            onClick={() => navigate("/profile")} 
            className="text-primary hover:underline font-medium ml-1"
          >
            Profile
          </button>
          .
        </div>
      </div>
    </div>
  )
}
