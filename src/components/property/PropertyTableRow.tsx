
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { Pencil } from "lucide-react"

interface Property {
  id: string
  name: string
  address: string
  purchase_price: number
  current_value: number
}

interface PropertyTableRowProps {
  property: Property
  selectedPropertyId: string | null
  onPropertySelect: (propertyId: string) => void
  onEditProperty: (property: Property) => void
  formatCurrency: (amount: number) => string
}

export function PropertyTableRow({
  property,
  selectedPropertyId,
  onPropertySelect,
  onEditProperty,
  formatCurrency,
}: PropertyTableRowProps) {
  return (
    <TableRow 
      key={property.id}
      className={`${
        property.id === selectedPropertyId ? "bg-primary/5" : ""
      } cursor-pointer hover:bg-muted/50 flex flex-col sm:table-row`}
      onClick={() => onPropertySelect(property.id)}
    >
      <TableCell className="w-[48px] align-middle hidden sm:table-cell">
        <div className="flex items-center justify-center h-full">
          <RadioGroupItem 
            value={property.id} 
            id={property.id}
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      </TableCell>
      <TableCell className="font-medium py-2 flex justify-between items-center sm:table-cell">
        <span>{property.name}</span>
        <div className="flex items-center gap-2 sm:hidden">
          <RadioGroupItem 
            value={property.id} 
            id={property.id}
            onClick={(e) => e.stopPropagation()} 
          />
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
      </TableCell>
      <TableCell className="py-2">{property.address}</TableCell>
      <TableCell className="py-2">
        <span className="font-medium sm:hidden">Purchase Price: </span>
        {formatCurrency(property.purchase_price)}
      </TableCell>
      <TableCell className="py-2">
        <span className="font-medium sm:hidden">Current Value: </span>
        {formatCurrency(property.current_value)}
      </TableCell>
      <TableCell className="hidden sm:table-cell">
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
      </TableCell>
    </TableRow>
  )
}
