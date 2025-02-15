
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
  isHighlighted = false,
  isTotal = false,
  className = ""
}: TaxTableRowProps) {
  const formattedValue = typeof value === 'number' ? formatCurrency(value) : value || "-"
  const textColor = isHighlighted ? "text-green-600" : ""
  const fontWeight = isTotal ? "font-semibold" : ""

  return (
    <TableRow className={`border-b border-gray-100 ${className}`}>
      <TableCell className={`font-medium ${textColor} ${fontWeight}`}>{label}</TableCell>
      <TableCell className={`text-right ${textColor} ${fontWeight}`}>{formattedValue}</TableCell>
    </TableRow>
  )
}
