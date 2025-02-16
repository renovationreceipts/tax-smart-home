
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TaxTableRow } from "./TaxTableRow"
import { formatCurrency } from "@/lib/utils"
import { useTaxCalculations } from "@/hooks/useTaxCalculations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Project } from "@/hooks/useProjects"
import { useState } from "react"

interface TaxCalculationTableProps {
  property: any
  projects: Project[]
  onProjectClick?: (project: Project) => void
}

type TimeFrame = "today" | "3" | "5" | "10" | "15"

export function TaxCalculationTable({ property, projects, onProjectClick }: TaxCalculationTableProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("10")
  const {
    totalProjectCosts,
    adjustedCostBasis,
    taxableGainWithBasis,
    taxableGainWithoutBasis,
    userTaxRate,
    exemptionAmount,
    finalTaxableGain,
    houseValueGrowthRate,
  } = useTaxCalculations({ property, projects })

  const calculateProjectedValue = (currentValue: number, years: number, growthRate: number) => {
    return currentValue * Math.pow(1 + growthRate / 100, years)
  }

  const yearsToProject = selectedTimeFrame === "today" ? 0 : parseInt(selectedTimeFrame)
  const projectedValue = calculateProjectedValue(property.current_value, yearsToProject, houseValueGrowthRate)
  const projectedTaxableGain = Math.max(0, projectedValue - adjustedCostBasis - exemptionAmount)
  const estimatedTax = projectedTaxableGain * userTaxRate

  const timeFrameOptions = [
    { value: "today", label: "Today" },
    { value: "3", label: "In 3 years" },
    { value: "5", label: "In 5 years" },
    { value: "10", label: "In 10 years" },
    { value: "15", label: "In 15 years" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">If You Sold Your Property...</h2>
        <Select
          value={selectedTimeFrame}
          onValueChange={(value) => setSelectedTimeFrame(value as TimeFrame)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeFrameOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-gray-500">Category</TableHead>
            <TableHead className="text-right text-gray-500">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TaxTableRow
            label="Projected Home Value"
            value={projectedValue}
          />
          <TaxTableRow
            label="Your Adjusted Cost Basis (Purchase Price + Tracked Improvements)"
            value={adjustedCostBasis}
            className="border-b border-gray-200"
          />
          <TaxTableRow
            label="Projected Capital Gains Before Exemptions"
            value={projectedValue - adjustedCostBasis}
          />
          <TaxTableRow
            label="Tracked Home Improvements Reduced Your Reported Gain By"
            value={totalProjectCosts}
            className="text-green-600 font-medium"
          />
          <TaxTableRow
            label="Without Tracking, Your Reported Gain Would Have Been"
            value={projectedValue - property.purchase_price}
          />
          <TaxTableRow
            label="Eligible Federal Capital Gains Exemption Applied (Based on filing status)"
            value={exemptionAmount}
          />
          <TaxTableRow
            label="Projected Federal Taxable Gain After Exemption"
            value={projectedTaxableGain}
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
