import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Property {
  id: string
  name: string
  address: string
  purchase_price: number
  current_value: number
}

interface PropertyListProps {
  properties: Property[]
  selectedPropertyId: string | null
  onPropertySelect: (propertyId: string) => void
}

export function PropertyList({ properties, selectedPropertyId, onPropertySelect }: PropertyListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Purchase Price</TableHead>
            <TableHead>Current Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow 
              key={property.id}
              className={`cursor-pointer hover:bg-gray-50 ${
                property.id === selectedPropertyId ? "bg-primary/5" : ""
              }`}
              onClick={() => onPropertySelect(property.id)}
            >
              <TableCell className="font-medium">{property.name}</TableCell>
              <TableCell>{property.address}</TableCell>
              <TableCell>{formatCurrency(property.purchase_price)}</TableCell>
              <TableCell>{formatCurrency(property.current_value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}