
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { Pencil } from "lucide-react"
import type { Property } from "@/hooks/useProperties"

interface PropertyTableRowProps {
  property: Property
  selectedPropertyId: string | null
  onPropertySelect: (propertyId: string) => void
  onEditProperty: (property: Property) => void
  formatCurrency: (amount: number) => string
  totalProperties: number
}

export function PropertyTableRow({
  property,
  selectedPropertyId,
  onPropertySelect,
  onEditProperty,
  formatCurrency,
  totalProperties,
}: PropertyTableRowProps) {
  const showRadio = totalProperties > 1;
  const formattedAddress = `${property.street_address}, ${property.city}, ${property.state} ${property.zip_code}`;

  return (
    <TableRow 
      key={property.id}
      className={`${
        property.id === selectedPropertyId ? "bg-primary/5" : "bg-white"
      } flex flex-col sm:table-row`}
    >
      {showRadio && (
        <TableCell className="w-[48px] align-middle hidden sm:table-cell">
          <div className="flex items-center justify-center h-full">
            <RadioGroupItem 
              value={property.id} 
              id={property.id}
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </TableCell>
      )}
      {/* Mobile View */}
      <TableCell className="py-4 flex flex-col gap-1 sm:hidden">
        <div className="flex items-start gap-4">
          {showRadio && (
            <div>
              <RadioGroupItem 
                value={property.id} 
                id={property.id}
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
          )}
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
