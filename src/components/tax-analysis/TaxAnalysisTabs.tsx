
import { useTaxCalculations } from "@/hooks/useTaxCalculations";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import type { Project } from "@/hooks/useProjects";
import type { Property } from "@/hooks/useProperties";
import { useState } from "react";
import { Link } from "react-router-dom";

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
  const projectedValue = calculateProjectedValue(selectedProperty?.current_value || 0, yearsToProject, houseValueGrowthRate);

  const timeFrameOptions = [{
    value: "today",
    label: "Today"
  }, {
    value: "3",
    label: "In 3 years"
  }, {
    value: "5",
    label: "In 5 years"
  }, {
    value: "10",
    label: "In 10 years"
  }, {
    value: "15",
    label: "In 15 years"
  }];

  const gainWithoutTracking = projectedValue - (selectedProperty?.purchase_price || 0);
  const gainWithTracking = projectedValue - adjustedCostBasis;
  const taxableAmountWithoutTracking = Math.max(0, gainWithoutTracking - exemptionAmount);
  const taxableAmountWithTracking = Math.max(0, gainWithTracking - exemptionAmount);
  const taxWithoutTracking = taxableAmountWithoutTracking * userTaxRate;
  const taxWithTracking = taxableAmountWithTracking * userTaxRate;
  const taxSavings = taxWithoutTracking - taxWithTracking;
  const showNoSavingsMessage = taxWithoutTracking === taxWithTracking;

  return <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">If You Sold Your Property...</h2>
        <Select value={selectedTimeFrame} onValueChange={value => setSelectedTimeFrame(value as TimeFrame)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeFrameOptions.map(option => <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border p-6 px-[2px]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-1/3">Category</TableHead>
              <TableHead className="w-1/3 text-right bg-[#F7FAFC]">With Renovation Receipts</TableHead>
              <TableHead className="w-1/3 text-right">Without Tracking Projects</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell>Sale Price</TableCell>
              <TableCell className="text-right bg-[#F7FAFC]">{formatCurrency(projectedValue)}</TableCell>
              <TableCell className="text-right">{formatCurrency(projectedValue)}</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell>Minus Purchase Price</TableCell>
              <TableCell className="text-right bg-[#F7FAFC]">{formatCurrency(selectedProperty?.purchase_price || 0)}</TableCell>
              <TableCell className="text-right">{formatCurrency(selectedProperty?.purchase_price || 0)}</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent border-b-2 border-gray-300">
              <TableCell>Minus Eligible Home Improvements</TableCell>
              <TableCell className="text-right bg-[#F7FAFC]">{formatCurrency(totalProjectCosts)} ✅</TableCell>
              <TableCell className="text-right">Unknown 🤷</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell><span className="font-medium">= Gain on Sale</span></TableCell>
              <TableCell className="text-right bg-[#F7FAFC]">{formatCurrency(gainWithTracking)}</TableCell>
              <TableCell className="text-right">{formatCurrency(gainWithoutTracking)}</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent border-b-2 border-gray-300">
              <TableCell>Minus Exempt Amount</TableCell>
              <TableCell className="text-right bg-[#F7FAFC]">{formatCurrency(exemptionAmount)}</TableCell>
              <TableCell className="text-right">{formatCurrency(exemptionAmount)}</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell><span className="font-medium">= Taxable Gain</span></TableCell>
              <TableCell className="text-right bg-[#F7FAFC]">
                {taxableAmountWithTracking === 0 && taxableAmountWithoutTracking > 0 ? <span>Fully Exempt 🎉</span> : formatCurrency(taxableAmountWithTracking)}
              </TableCell>
              <TableCell className="text-right">{formatCurrency(taxableAmountWithoutTracking)}</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent font-bold">
              <TableCell>Federal Tax Owed ({(userTaxRate * 100).toFixed(1)}%)</TableCell>
              <TableCell className="text-right bg-[#F7FAFC]">
                {taxWithTracking === 0 && taxWithoutTracking > 0 ? <span>Fully Exempt 🎉</span> : formatCurrency(taxWithTracking)}
              </TableCell>
              <TableCell className="text-right">{formatCurrency(taxWithoutTracking)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {taxSavings > 0 && <div className="mt-6 space-y-2 text-center">
            <p className="text-blue-500 font-semibold flex items-center gap-2 text-lg justify-center">
              <span className="text-2xl">💰</span>
              By tracking home improvements, you saved {formatCurrency(taxSavings)} in taxes!
            </p>
            <p className="text-gray-600 text-base">
              Update your tax filing status, federal cap gains rate, and home value appreciation rate in your{" "}
              <Link to="/profile" className="text-blue-500 hover:underline">
                Profile
              </Link>
              .
            </p>
          </div>}
      </div>

      {showNoSavingsMessage && <Card className="p-6 bg-gray-50 border-gray-200">
          <h3 className="text-lg font-semibold mb-2">No Tax Savings Yet</h3>
          <p className="text-gray-600">While you're not seeing tax savings yet, tracking your home improvements is still crucial. As your home appreciates in value, these records could save you thousands in taxes when you sell. Plus, having organized records helps with insurance claims and auditability of tax credits and other rebates.</p>
        </Card>}
    </div>;
}
