
import { TableCell, TableRow } from "@/components/ui/table";
import { InfoTooltip } from "./InfoTooltip";
import { formatCurrency } from "@/lib/utils";

interface TableRowWithTooltipProps {
  label: string;
  tooltipTitle: string;
  tooltipContent: string;
  valueWithTracking: number;
  valueWithoutTracking: number;
  className?: string;
  showCheckmark?: boolean;
  showUnknown?: boolean;
}

export function TableRowWithTooltip({
  label,
  tooltipTitle,
  tooltipContent,
  valueWithTracking,
  valueWithoutTracking,
  className = "",
  showCheckmark = false,
  showUnknown = false
}: TableRowWithTooltipProps) {
  return (
    <TableRow className={`hover:bg-transparent ${className}`}>
      <TableCell className="flex items-center gap-1">
        {label}
        <InfoTooltip title={tooltipTitle} content={tooltipContent} />
      </TableCell>
      <TableCell className="text-right bg-[#F7FAFC]">
        {formatCurrency(valueWithTracking)}
        {showCheckmark && " ✅"}
      </TableCell>
      <TableCell className="text-right">
        {showUnknown ? "Unknown 🤷" : formatCurrency(valueWithoutTracking)}
      </TableCell>
    </TableRow>
  );
}
