
import { Table, TableBody } from "@/components/ui/table"
import { PropertyTableHeader } from "./PropertyTableHeader"
import { PropertyTableRow } from "./PropertyTableRow"
import type { Property } from "@/hooks/useProperties"

interface PropertyListProps {
  properties: Property[]
  onEditProperty: (property: Property) => void
}

export function PropertyList({ 
  properties, 
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <PropertyTableHeader />
        <TableBody>
          {properties.map((property) => (
            <PropertyTableRow
              key={property.id}
              property={property}
              onEditProperty={onEditProperty}
              formatCurrency={formatCurrency}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
