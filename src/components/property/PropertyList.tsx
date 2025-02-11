
import { Table, TableBody } from "@/components/ui/table"
import { RadioGroup } from "@/components/ui/radio-group"
import { PropertyTableHeader } from "./PropertyTableHeader"
import { PropertyTableRow } from "./PropertyTableRow"
import type { Property } from "@/hooks/useProperties"

interface PropertyListProps {
  properties: Property[]
  selectedPropertyId: string | null
  onPropertySelect: (propertyId: string) => void
  onEditProperty: (property: Property) => void
}

export function PropertyList({ 
  properties, 
  selectedPropertyId, 
  onPropertySelect,
  onEditProperty 
}: PropertyListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // If there's only one property and nothing is selected, select it
  if (properties.length === 1 && !selectedPropertyId) {
    onPropertySelect(properties[0].id)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <RadioGroup 
        value={properties.length === 1 ? properties[0].id : (selectedPropertyId || "")}
        onValueChange={onPropertySelect}
      >
        <Table>
          <PropertyTableHeader showRadio={properties.length > 1} />
          <TableBody>
            {properties.map((property) => (
              <PropertyTableRow
                key={property.id}
                property={property}
                selectedPropertyId={properties.length === 1 ? properties[0].id : selectedPropertyId}
                onPropertySelect={onPropertySelect}
                onEditProperty={onEditProperty}
                formatCurrency={formatCurrency}
                totalProperties={properties.length}
              />
            ))}
          </TableBody>
        </Table>
      </RadioGroup>
    </div>
  )
}
