
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

interface TaxAnalysisTableProps {
  projectedValue: number;
  purchasePrice: number;
  totalProjectCosts: number;
  gainWithTracking: number;
  gainWithoutTracking: number;
  exemptionAmount: number;
  taxableAmountWithTracking: number;
  taxableAmountWithoutTracking: number;
  taxWithTracking: number;
  taxWithoutTracking: number;
  userTaxRate: number;
}

export function TaxAnalysisTable({
  projectedValue,
  purchasePrice,
  totalProjectCosts,
  gainWithTracking,
  gainWithoutTracking,
  exemptionAmount,
  taxableAmountWithTracking,
  taxableAmountWithoutTracking,
  taxWithTracking,
  taxWithoutTracking,
  userTaxRate
}: TaxAnalysisTableProps) {
  const [isSalePriceTooltipOpen, setIsSalePriceTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsSalePriceTooltipOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSalePriceTooltipOpen(!isSalePriceTooltipOpen);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-1/3">Category</TableHead>
          <TableHead className="w-1/3 text-right bg-[#F7FAFC] font-bold">With Renovation Receipts</TableHead>
          <TableHead className="w-1/3 text-right">Without Tracking Projects</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell className="flex items-center gap-1">
            Sale Price
            <TooltipProvider>
              <Tooltip open={isSalePriceTooltipOpen}>
                <TooltipTrigger asChild>
                  <Info 
                    className="h-4 w-4 text-gray-400 cursor-pointer" 
                    onClick={handleInfoClick}
                  />
                </TooltipTrigger>
                <TooltipContent 
                  className="max-w-sm" 
                  ref={tooltipRef}
                  sideOffset={5}
                >
                  <div className="space-y-2">
                    <p className="font-semibold">Sale Price</p>
                    <p className="text-sm">
                      This value represents your current home value (that you entered when you added the property) 
                      appreciated by the home value appreciation rate in your Profile over the number of years 
                      you have set in the dropdown selector.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          <TableCell className="text-right bg-[#F7FAFC]">{formatCurrency(projectedValue)}</TableCell>
          <TableCell className="text-right">{formatCurrency(projectedValue)}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-transparent">
          <TableCell>Minus Purchase Price</TableCell>
          <TableCell className="text-right bg-[#F7FAFC]">{formatCurrency(purchasePrice)}</TableCell>
          <TableCell className="text-right">{formatCurrency(purchasePrice)}</TableCell>
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
            {taxableAmountWithTracking === 0 && taxableAmountWithoutTracking > 0 ? (
              <span>Fully Exempt 🎉</span>
            ) : (
              formatCurrency(taxableAmountWithTracking)
            )}
          </TableCell>
          <TableCell className="text-right">{formatCurrency(taxableAmountWithoutTracking)}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-transparent font-bold">
          <TableCell>Federal Tax Owed ({(userTaxRate * 100).toFixed(1)}%)</TableCell>
          <TableCell className="text-right bg-[#F7FAFC]">
            {taxWithTracking === 0 && taxWithoutTracking > 0 ? (
              <span>Fully Exempt 🎉</span>
            ) : (
              formatCurrency(taxWithTracking)
            )}
          </TableCell>
          <TableCell className="text-right">{formatCurrency(taxWithoutTracking)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
