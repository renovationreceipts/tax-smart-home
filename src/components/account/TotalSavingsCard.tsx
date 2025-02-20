
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { NumberTransition } from "@/components/ui/NumberTransition";

interface TotalSavingsCardProps {
  projectedTaxSavings: number;
  totalProjectCosts: number;
  userTaxRate: number;
}

export function TotalSavingsCard({
  projectedTaxSavings,
  totalProjectCosts,
  userTaxRate,
}: TotalSavingsCardProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');

  const handleTaxAnalysisClick = () => {
    if (propertyId) {
      navigate(`/tax-analysis?propertyId=${propertyId}`);
    } else {
      navigate('/tax-analysis');
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-1">Tax Analysis</h3>
          <p className="text-sm text-gray-500">
            Your projected tax savings when you sell your home
          </p>
        </div>
      </div>

      <div className="pt-2">
        <div className="text-3xl font-bold mb-2">
          <NumberTransition value={projectedTaxSavings} formatter={formatCurrency} />
        </div>
        <div className="text-sm text-gray-500">
          Based on your {(userTaxRate * 100).toFixed(1)}% tax rate and{" "}
          {formatCurrency(totalProjectCosts)} in tracked improvements
        </div>
      </div>

      <button
        onClick={handleTaxAnalysisClick}
        className="w-full flex items-center justify-center gap-2 text-[#0090FF] hover:text-blue-700 font-medium"
      >
        View Full Tax Analysis
        <ArrowRight className="h-4 w-4" />
      </button>
    </Card>
  );
}
