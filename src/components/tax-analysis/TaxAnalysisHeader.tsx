import { formatCurrency } from "@/lib/utils";
interface TaxAnalysisHeaderProps {
  projectedTaxSavings: number;
}
export function TaxAnalysisHeader({
  projectedTaxSavings
}: TaxAnalysisHeaderProps) {
  return <div>
      <div className="mb-2">
        <h1 className="text-3xl font-bold">See How Tracking Your Home Projects Put More Money in Your Pocket</h1>
        <p className="text-gray-500 text-lg">Comprehensive breakdown of your potential savings</p>
      </div>
    </div>;
}