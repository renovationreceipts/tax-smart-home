
import { TableCell, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

interface TaxTableRowProps {
  label: string
  value: number | string | null
  isHighlighted?: boolean
  isTotal?: boolean
  className?: string
}

export function TaxTableRow({ 
  label, 
  value, 
  className = ""
}: TaxTableRowProps) {
  const formattedValue = typeof value === 'number' ? formatCurrency(value) : value || "-"

  return (
    <TableRow className={`hover:bg-transparent ${className}`}>
      <TableCell className="py-4 font-medium">{label}</TableCell>
      <TableCell className="text-right py-4 font-medium">{formattedValue}</TableCell>
    </TableRow>
  )
}
