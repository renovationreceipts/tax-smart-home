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
  const [isPurchasePriceTooltipOpen, setIsPurchasePriceTooltipOpen] = useState(false);
  const [isHomeImprovementsTooltipOpen, setIsHomeImprovementsTooltipOpen] = useState(false);
  const [isGainOnSaleTooltipOpen, setIsGainOnSaleTooltipOpen] = useState(false);
  const salePriceTooltipRef = useRef<HTMLDivElement>(null);
  const purchasePriceTooltipRef = useRef<HTMLDivElement>(null);
  const homeImprovementsTooltipRef = useRef<HTMLDivElement>(null);
  const gainOnSaleTooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (salePriceTooltipRef.current && !salePriceTooltipRef.current.contains(event.target as Node)) {
        setIsSalePriceTooltipOpen(false);
      }
      if (purchasePriceTooltipRef.current && !purchasePriceTooltipRef.current.contains(event.target as Node)) {
        setIsPurchasePriceTooltipOpen(false);
      }
      if (homeImprovementsTooltipRef.current && !homeImprovementsTooltipRef.current.contains(event.target as Node)) {
        setIsHomeImprovementsTooltipOpen(false);
      }
      if (gainOnSaleTooltipRef.current && !gainOnSaleTooltipRef.current.contains(event.target as Node)) {
        setIsGainOnSaleTooltipOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSalePriceInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSalePriceTooltipOpen(!isSalePriceTooltipOpen);
  };

  const handlePurchasePriceInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPurchasePriceTooltipOpen(!isPurchasePriceTooltipOpen);
  };

  const handleHomeImprovementsInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHomeImprovementsTooltipOpen(!isHomeImprovementsTooltipOpen);
  };

  const handleGainOnSaleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGainOnSaleTooltipOpen(!isGainOnSaleTooltipOpen);
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
                    onClick={handleSalePriceInfoClick}
                  />
                </TooltipTrigger>
                <TooltipContent 
                  className="max-w-sm" 
                  ref={salePriceTooltipRef}
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
          <TableCell className="flex items-center gap-1">
            Minus Purchase Price
            <TooltipProvider>
              <Tooltip open={isPurchasePriceTooltipOpen}>
                <TooltipTrigger asChild>
                  <Info 
                    className="h-4 w-4 text-gray-400 cursor-pointer" 
                    onClick={handlePurchasePriceInfoClick}
                  />
                </TooltipTrigger>
                <TooltipContent 
                  className="max-w-sm" 
                  ref={purchasePriceTooltipRef}
                  sideOffset={5}
                >
                  <div className="space-y-2">
                    <p className="font-semibold">Minus Purchase Price</p>
                    <p className="text-sm">
                      Here, we are subtracting what you paid for your property from the Sale Price.
                    </p>
                    <p className="text-sm">
                      You entered what you paid for your property when you added the property initially. 
                      This can be modified in your Profile.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          <TableCell className="text-right bg-[#F7FAFC]">{formatCurrency(purchasePrice)}</TableCell>
          <TableCell className="text-right">{formatCurrency(purchasePrice)}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-transparent border-b-2 border-gray-300">
          <TableCell className="flex items-center gap-1">
            Minus Eligible Home Improvements
            <TooltipProvider>
              <Tooltip open={isHomeImprovementsTooltipOpen}>
                <TooltipTrigger asChild>
                  <Info 
                    className="h-4 w-4 text-gray-400 cursor-pointer" 
                    onClick={handleHomeImprovementsInfoClick}
                  />
                </TooltipTrigger>
                <TooltipContent 
                  className="max-w-sm" 
                  ref={homeImprovementsTooltipRef}
                  sideOffset={5}
                >
                  <div className="space-y-2">
                    <p className="font-semibold">Minus Eligible Home Improvements</p>
                    <p className="text-sm">
                      Here, we are further subtracting your eligible projects / home improvement costs from the Sale Price.
                    </p>
                    <p className="text-sm">
                      This is where the magic happens by reducing the gain on your sale.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          <TableCell className="text-right bg-[#F7FAFC]">{formatCurrency(totalProjectCosts)} ✅</TableCell>
          <TableCell className="text-right">Unknown 🤷</TableCell>
        </TableRow>
        <TableRow className="hover:bg-transparent">
          <TableCell className="flex items-center gap-1">
            <span className="font-medium">= Gain on Sale</span>
            <TooltipProvider>
              <Tooltip open={isGainOnSaleTooltipOpen}>
                <TooltipTrigger asChild>
                  <Info 
                    className="h-4 w-4 text-gray-400 cursor-pointer" 
                    onClick={handleGainOnSaleInfoClick}
                  />
                </TooltipTrigger>
                <TooltipContent 
                  className="max-w-sm" 
                  ref={gainOnSaleTooltipRef}
                  sideOffset={5}
                >
                  <div className="space-y-2">
                    <p className="font-semibold">Gain on Sale</p>
                    <p className="text-sm">
                      This is the gain or how much you earned from selling your property which is calculated by subtracting what you paid for the property initially and your eligible improvements from the sale price.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
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
