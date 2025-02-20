
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import type { Property } from "@/hooks/useProperties"

interface PropertyTableRowProps {
  property: Property
  onEditProperty: (property: Property) => void
  formatCurrency: (amount: number) => string
}

export function PropertyTableRow({
  property,
  onEditProperty,
  formatCurrency,
}: PropertyTableRowProps) {
  const formattedAddress = `${property.street_address}, ${property.city}, ${property.state} ${property.zip_code}`;

  return (
    <TableRow className="flex flex-col sm:table-row">
      {/* Mobile View */}
      <TableCell className="py-4 flex flex-col gap-1 sm:hidden">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <h3 className="text-lg font-bold mb-1">{property.name}</h3>
            <p className="text-gray-600 text-base">{formattedAddress}</p>
          </div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onEditProperty(property)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3 space-y-2 text-base">
          <div className="flex justify-between">
            <span className="text-gray-600">Purchase Price:</span>
            <span className="font-medium">{formatCurrency(property.purchase_price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Value:</span>
            <span className="font-medium">{formatCurrency(property.current_value)}</span>
          </div>
        </div>
      </TableCell>
      {/* Desktop View */}
      <TableCell className="hidden sm:table-cell py-4 text-base">{property.name}</TableCell>
      <TableCell className="hidden sm:table-cell py-4 text-base">{formattedAddress}</TableCell>
      <TableCell className="hidden sm:table-cell py-4 text-base">{formatCurrency(property.purchase_price)}</TableCell>
      <TableCell className="hidden sm:table-cell py-4 text-base">{formatCurrency(property.current_value)}</TableCell>
      <TableCell className="hidden sm:table-cell py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEditProperty(property)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
