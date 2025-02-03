import { TableCell, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

interface TaxTableRowProps {
  label: string
  value: number | string | null
  isHighlighted?: boolean
  className?: string
}

export function TaxTableRow({ 
  label, 
  value, 
  isHighlighted = false,
  className = ""
}: TaxTableRowProps) {
  const formattedValue = typeof value === 'number' ? formatCurrency(value) : value || "-"
  const textColor = isHighlighted ? "text-green-600" : ""

  return (
    <TableRow className={`border-b border-gray-100 ${className}`}>
      <TableCell className={`font-medium ${textColor}`}>{label}</TableCell>
      <TableCell className={`text-right ${textColor}`}>{formattedValue}</TableCell>
    </TableRow>
  )
}