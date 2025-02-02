import { TableCell, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

interface TaxTableRowProps {
  label: string
  value: number | string | null
  isHighlighted?: boolean
}

export function TaxTableRow({ label, value, isHighlighted = false }: TaxTableRowProps) {
  const formattedValue = typeof value === 'number' ? formatCurrency(value) : value || "-"
  const textColor = isHighlighted ? "text-green-600" : ""

  return (
    <TableRow>
      <TableCell className={`font-medium ${textColor}`}>{label}</TableCell>
      <TableCell className={`text-right ${textColor}`}>{formattedValue}</TableCell>
    </TableRow>
  )
}