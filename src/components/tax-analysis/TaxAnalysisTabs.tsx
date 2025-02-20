
import { useTaxCalculations } from "@/hooks/useTaxCalculations";
import type { Project } from "@/hooks/useProjects";
import type { Property } from "@/hooks/useProperties";
import { TimeFrameSelector, type TimeFrame } from "./TimeFrameSelector";
import { TaxAnalysisTable } from "./TaxAnalysisTable";
import { TaxSavingsMessage } from "./TaxSavingsMessage";
import { NoSavingsMessage } from "./NoSavingsMessage";
import { useState } from "react";

interface TaxAnalysisTabsProps {
  projectedTaxSavings: number;
  projects: Project[];
  selectedProperty: Property | undefined;
}

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

  const gainWithoutTracking = projectedValue - (selectedProperty?.purchase_price || 0);
  const gainWithTracking = projectedValue - adjustedCostBasis;
  const taxableAmountWithoutTracking = Math.max(0, gainWithoutTracking - exemptionAmount);
  const taxableAmountWithTracking = Math.max(0, gainWithTracking - exemptionAmount);
  const taxWithoutTracking = taxableAmountWithoutTracking * userTaxRate;
  const taxWithTracking = taxableAmountWithTracking * userTaxRate;
  const taxSavings = taxWithoutTracking - taxWithTracking;
  const showNoSavingsMessage = taxWithoutTracking === taxWithTracking;

  return (
    <div className="space-y-8">
      <TimeFrameSelector
        selectedTimeFrame={selectedTimeFrame}
        onTimeFrameChange={setSelectedTimeFrame}
      />

      <div className="bg-white rounded-xl border p-6 px-[2px]">
        <TaxAnalysisTable
          projectedValue={projectedValue}
          purchasePrice={selectedProperty?.purchase_price || 0}
          totalProjectCosts={totalProjectCosts}
          gainWithTracking={gainWithTracking}
          gainWithoutTracking={gainWithoutTracking}
          exemptionAmount={exemptionAmount}
          taxableAmountWithTracking={taxableAmountWithTracking}
          taxableAmountWithoutTracking={taxableAmountWithoutTracking}
          taxWithTracking={taxWithTracking}
          taxWithoutTracking={taxWithoutTracking}
          userTaxRate={userTaxRate}
        />
        <TaxSavingsMessage taxSavings={taxSavings} />
      </div>

      {showNoSavingsMessage && <NoSavingsMessage />}
    </div>
  );
}
