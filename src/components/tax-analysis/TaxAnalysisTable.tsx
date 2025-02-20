
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { TableRowWithTooltip } from "./TableRowWithTooltip";

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
        <TableRowWithTooltip
          label="Sale Price"
          tooltipTitle="Sale Price"
          tooltipContent="This value represents your current home value (that you entered when you added the property) appreciated by the home value appreciation rate in your Profile over the number of years you have set in the dropdown selector."
          valueWithTracking={projectedValue}
          valueWithoutTracking={projectedValue}
        />
        <TableRowWithTooltip
          label="Minus Purchase Price"
          tooltipTitle="Minus Purchase Price"
          tooltipContent="Here, we are subtracting what you paid for your property from the Sale Price. You entered what you paid for your property when you added the property initially. This can be modified in your Profile."
          valueWithTracking={purchasePrice}
          valueWithoutTracking={purchasePrice}
        />
        <TableRowWithTooltip
          label="Minus Eligible Home Improvements"
          tooltipTitle="Minus Eligible Home Improvements"
          tooltipContent="Here, we are further subtracting your eligible projects / home improvement costs from the Sale Price. This is where the magic happens by reducing the gain on your sale."
          valueWithTracking={totalProjectCosts}
          valueWithoutTracking={0}
          className="border-b-2 border-gray-300"
          showCheckmark={true}
          showUnknown={true}
        />
        <TableRowWithTooltip
          label={<span className="font-medium">= Gain on Sale</span>}
          tooltipTitle="Gain on Sale"
          tooltipContent="This is the gain or how much you earned from selling your property which is calculated by subtracting what you paid for the property initially and your eligible improvements from the sale price."
          valueWithTracking={gainWithTracking}
          valueWithoutTracking={gainWithoutTracking}
        />
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
