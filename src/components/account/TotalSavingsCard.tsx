
import { CircleDollarSign, ArrowRight, FileText, Building2, Banknote, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NumberTransition } from "@/components/ui/NumberTransition";
import { formatCurrency } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TotalSavingsCardProps {
  projectedTaxSavings: number;
  totalProjectCosts: number;
  userTaxRate: number;
}

export function TotalSavingsCard({ 
  projectedTaxSavings,
  totalProjectCosts,
  userTaxRate
}: TotalSavingsCardProps) {
  const navigate = useNavigate();

  const tooltipContent = (
    <div className="space-y-1">
      <p className="font-medium">How We Calculate Your Savings</p>
      <p className="text-sm text-muted-foreground">
        This is your projected tax savings based on your eligible home improvements
        and current tax rate. The actual amount may vary.
      </p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="hidden sm:flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-6 w-6 text-[#0090FF]" />
          <h3 className="text-2xl font-semibold">Total Savings</h3>
        </div>
      </div>

      <div className="sm:hidden py-4 px-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold mb-1">
              <NumberTransition value={projectedTaxSavings} />
            </div>
            <div className="text-gray-600 text-sm flex items-center gap-1">
              Lifetime projected savings
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent showArrow>{tooltipContent}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Button variant="link" onClick={() => navigate("/tax-analysis")} className="text-[#0090FF] hover:text-[#0090FF]/90 p-0 text-sm">
            View Details
          </Button>
        </div>
      </div>

      <div className="hidden sm:block px-6">
        <div className="mb-8">
          <div className="text-center">
            <div className="text-4xl font-semibold leading-none mb-2">
              <NumberTransition value={projectedTaxSavings} />
            </div>
            <div className="text-gray-500 text-sm flex items-center justify-center gap-1">
              Lifetime projected savings
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent showArrow>{tooltipContent}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Eligible Projects Total</span>
            </div>
            <span className="text-sm">{formatCurrency(totalProjectCosts)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-gray-400" />
              <span className="text-sm">x Your Tax Rate</span>
            </div>
            <span className="text-sm">{(userTaxRate * 100).toFixed(1)}%</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-lg">
              <Banknote className="h-5 w-5 text-gray-400" />
              <span className="text-sm">= Lifetime Savings</span>
            </div>
            <span className="text-sm">{formatCurrency(projectedTaxSavings)}</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => navigate("/tax-analysis")} 
          className="w-full mt-8 text-[#0090FF] border-[#0090FF] hover:bg-[#0090FF]/5 font-normal my-[28px]"
        >
          View Full Analysis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
