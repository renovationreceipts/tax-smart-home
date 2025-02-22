import { CircleDollarSign, ArrowRight, FileText, Building2, Banknote, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NumberTransition } from "@/components/ui/NumberTransition";
import { formatCurrency } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
interface TotalSavingsCardProps {
  projectedTaxSavings: number;
  totalProjectCosts: number;
  userTaxRate: number;
  propertyId?: string;
}
export function TotalSavingsCard({
  projectedTaxSavings,
  totalProjectCosts,
  userTaxRate,
  propertyId
}: TotalSavingsCardProps) {
  const navigate = useNavigate();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hasProjects = totalProjectCosts > 0;
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsTooltipOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleViewAnalysis = () => {
    const path = propertyId ? `/tax-analysis?propertyId=${propertyId}` : '/tax-analysis';
    navigate(path);
  };
  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTooltipOpen(!isTooltipOpen);
  };
  const tooltipContent = <div ref={tooltipRef} className="space-y-3 max-w-sm">
      <div>
        <p className="font-semibold text-base text-white">Lifetime Projected Savings</p>
      </div>
      <div>
        <p className="font-medium mb-1 text-white">What does this number mean?</p>
        <p className="text-sm text-gray-200">
          Your Total Lifetime Savings represents how much you could reduce your future tax bill when selling your home by tracking your home improvement projects.
        </p>
      </div>
      <div>
        <p className="font-medium mb-1 text-white">How is it calculated?</p>
        <p className="text-sm text-gray-200">
          We apply the IRS cost basis adjustment rules to your eligible home projects. The formula is:
        </p>
        <p className="text-sm text-gray-200 italic mt-1">
          Eligible Home Improvements × Your Capital Gains Tax Rate = Total Lifetime Savings
        </p>
      </div>
      <div>
        <p className="font-medium mb-1 text-white">Why does this matter?</p>
        <p className="text-sm text-gray-200">
          When you sell your home, the IRS taxes your profit (Sale Price - Purchase Price - Qualifying Improvements). By tracking eligible projects, you lower your taxable profit and reduce the federal capital gain taxes you owe.
        </p>
      </div>
      <div>
        <p className="font-medium mb-1 text-white">What's next?</p>
        <p className="text-sm text-gray-200">
          Keep adding projects to maximize your savings and ensure you never overpay on taxes when you sell!
        </p>
      </div>
    </div>;
  const EmptyStateContent = () => {
    if (isMobile) {
      return <div className="px-6 py-[10px]">
          <div className="flex items-center gap-2 mb-4">
            <CircleDollarSign className="h-6 w-6 text-[#0090FF]" />
            <h3 className="text-xl font-semibold">Total Savings</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 py-[3px]">
            <p className="text-gray-700 text-base">
              Add your first project to start to see your savings add up.
            </p>
          </div>
        </div>;
    }
    return <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-6">
          <CircleDollarSign className="h-6 w-6 text-[#0090FF]" />
          <h3 className="text-2xl font-semibold">Total Savings</h3>
        </div>

        <div className="text-center">
          <div className="text-5xl font-bold mb-2">$0</div>
          <div className="text-gray-500 text-sm flex items-center justify-center gap-1 mb-8">
            Lifetime projected savings
            <TooltipProvider>
              <Tooltip open={isTooltipOpen}>
                <TooltipTrigger asChild onClick={handleInfoClick}>
                  <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent side="bottom">{tooltipContent}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="font-medium text-center text-sm">Add your first eligible home project and watch your savings add up.</p>
          </div>

          <Button variant="outline" onClick={handleViewAnalysis} disabled={true} className="w-full text-[#0090FF] border-[#0090FF] hover:bg-[#0090FF]/5 font-normal opacity-50 cursor-not-allowed">
            View Full Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>;
  };
  if (!hasProjects) {
    return <div className="bg-white rounded-xl shadow-sm">
        <EmptyStateContent />
      </div>;
  }
  return <div className="bg-white rounded-xl shadow-sm">
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
                <Tooltip open={isTooltipOpen}>
                  <TooltipTrigger asChild onClick={handleInfoClick}>
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{tooltipContent}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Button variant="link" onClick={handleViewAnalysis} className="text-[#0090FF] hover:text-[#0090FF]/90 p-0 text-sm">
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
                <Tooltip open={isTooltipOpen}>
                  <TooltipTrigger asChild onClick={handleInfoClick}>
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{tooltipContent}</TooltipContent>
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

        <Button variant="outline" onClick={handleViewAnalysis} className="w-full mt-8 text-[#0090FF] border-[#0090FF] hover:bg-[#0090FF]/5 font-normal my-[28px]">
          View Full Analysis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>;
}