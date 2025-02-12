
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table"
import { TaxTableRow } from "./TaxTableRow"
import { useTaxCalculations } from "@/hooks/useTaxCalculations"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

interface TaxCalculationTableProps {
  property: any
  projects: any[]
}

export function TaxCalculationTable({ property, projects }: TaxCalculationTableProps) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
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

  // Calculate total capital gains before exemptions
  const totalCapitalGains = property ? (property.current_value || 0) - adjustedCostBasis : 0

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
            value={totalCapitalGains}
          />
          <TaxTableRow 
            label="Tracked Home Improvements Reduced Your Reported Gain By"
            value={newCostBasis}
          />
        </TableBody>
      </Table>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-primary hover:underline">
          See Detailed Calculation
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          {/* Second Table: Tax Calculations */}
          <div className="mt-6">
            <Table>
              <TableBody>
                <TaxTableRow 
                  label="Without Tracking, Your Reported Gain Would Have Been"
                  value={taxableGainWithoutBasis}
                />
                <TaxTableRow 
                  label="📉 Eligible Federal Capital Gains Exemption Applied (Based on filing status)"
                  value={taxSavings}
                />
                <TaxTableRow 
                  label="Final Federal Taxable Gain After Exemption"
                  value={estimatedTaxSavings}
                />
              </TableBody>
            </Table>
          </div>
        </CollapsibleContent>
      </Collapsible>

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
