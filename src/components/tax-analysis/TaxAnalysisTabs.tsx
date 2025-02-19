
import { useTaxCalculations } from "@/hooks/useTaxCalculations";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import type { Project } from "@/hooks/useProjects";
import type { Property } from "@/hooks/useProperties";
import { useState } from "react";

interface TaxAnalysisTabsProps {
  projectedTaxSavings: number;
  projects: Project[];
  selectedProperty: Property | undefined;
}

type TimeFrame = "today" | "3" | "5" | "10" | "15";

export function TaxAnalysisTabs({
  projects,
  selectedProperty
}: TaxAnalysisTabsProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("10");

  const {
    totalProjectCosts,
    adjustedCostBasis,
    userTaxRate,
    exemptionAmount,
    houseValueGrowthRate
  } = useTaxCalculations({
    property: selectedProperty,
    projects
  });

  const calculateProjectedValue = (currentValue: number, years: number, growthRate: number) => {
    return currentValue * Math.pow(1 + growthRate / 100, years);
  };

  const yearsToProject = selectedTimeFrame === "today" ? 0 : parseInt(selectedTimeFrame);
  const projectedValue = calculateProjectedValue(
    selectedProperty?.current_value || 0,
    yearsToProject,
    houseValueGrowthRate
  );

  const timeFrameOptions = [
    { value: "today", label: "Today" },
    { value: "3", label: "In 3 years" },
    { value: "5", label: "In 5 years" },
    { value: "10", label: "In 10 years" },
    { value: "15", label: "In 15 years" }
  ];

  // Calculate gains by subtracting cost basis from sale price
  const gainWithoutTracking = projectedValue - (selectedProperty?.purchase_price || 0);
  const gainWithTracking = projectedValue - adjustedCostBasis;

  const taxableAmountWithoutTracking = Math.max(0, gainWithoutTracking - exemptionAmount);
  const taxableAmountWithTracking = Math.max(0, gainWithTracking - exemptionAmount);
  
  const taxWithoutTracking = taxableAmountWithoutTracking * userTaxRate;
  const taxWithTracking = taxableAmountWithTracking * userTaxRate;

  const showNoSavingsMessage = taxWithoutTracking === taxWithTracking;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">If You Sold Your Property...</h2>
        <Select value={selectedTimeFrame} onValueChange={value => setSelectedTimeFrame(value as TimeFrame)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeFrameOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-1/3">Category</TableHead>
              <TableHead className="w-1/3 text-right">Without Tracking Projects</TableHead>
              <TableHead className="w-1/3 text-right">With Renovation Receipts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Purchase Price</TableCell>
              <TableCell className="text-right">{formatCurrency(selectedProperty?.purchase_price || 0)}</TableCell>
              <TableCell className="text-right">{formatCurrency(selectedProperty?.purchase_price || 0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Home Improvements</TableCell>
              <TableCell className="text-right">Unknown 🤷</TableCell>
              <TableCell className="text-right">{formatCurrency(totalProjectCosts)} ✅</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sale Price</TableCell>
              <TableCell className="text-right">{formatCurrency(projectedValue)}</TableCell>
              <TableCell className="text-right">{formatCurrency(projectedValue)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cost Basis</TableCell>
              <TableCell className="text-right">{formatCurrency(selectedProperty?.purchase_price || 0)}</TableCell>
              <TableCell className="text-right">{formatCurrency(adjustedCostBasis)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gain on Sale</TableCell>
              <TableCell className="text-right">{formatCurrency(gainWithoutTracking)}</TableCell>
              <TableCell className="text-right">{formatCurrency(gainWithTracking)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Exempt Amount</TableCell>
              <TableCell className="text-right">{formatCurrency(exemptionAmount)}</TableCell>
              <TableCell className="text-right">{formatCurrency(exemptionAmount)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxable Amount</TableCell>
              <TableCell className="text-right">{formatCurrency(taxableAmountWithoutTracking)}</TableCell>
              <TableCell className="text-right">
                {taxableAmountWithTracking === 0 ? (
                  <span>Fully Exempt 🎉</span>
                ) : (
                  formatCurrency(taxableAmountWithTracking)
                )}
              </TableCell>
            </TableRow>
            <TableRow className="border-t font-medium">
              <TableCell>Federal Tax Owed ({(userTaxRate * 100).toFixed(1)}%)</TableCell>
              <TableCell className="text-right">{formatCurrency(taxWithoutTracking)}</TableCell>
              <TableCell className="text-right">
                {taxWithTracking === 0 ? (
                  <span>Fully Exempt 🎉</span>
                ) : (
                  formatCurrency(taxWithTracking)
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {showNoSavingsMessage && (
        <Card className="p-6 bg-gray-50 border-gray-200">
          <h3 className="text-lg font-semibold mb-2">No Tax Savings Yet</h3>
          <p className="text-gray-600">
            While you're not seeing tax savings yet, tracking your home improvements is still crucial. 
            As your home appreciates in value, these records could save you thousands in taxes when you sell. 
            Plus, having organized records helps with insurance claims and future renovations.
          </p>
        </Card>
      )}
    </div>
  );
}
