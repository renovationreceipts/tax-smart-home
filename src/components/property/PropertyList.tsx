import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Pencil } from "lucide-react"

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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <RadioGroup 
        value={selectedPropertyId || ""} 
        onValueChange={onPropertySelect}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Property Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Purchase Price</TableHead>
              <TableHead>Current Value</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow 
                key={property.id}
                className={`${
                  property.id === selectedPropertyId ? "bg-primary/5" : ""
                }`}
              >
                <TableCell className="flex items-center justify-center">
                  <RadioGroupItem value={property.id} id={property.id} />
                </TableCell>
                <TableCell className="font-medium">
                  <label 
                    htmlFor={property.id}
                    className="block cursor-pointer"
                  >
                    {property.name}
                  </label>
                </TableCell>
                <TableCell>
                  <label 
                    htmlFor={property.id}
                    className="block cursor-pointer"
                  >
                    {property.address}
                  </label>
                </TableCell>
                <TableCell>
                  <label 
                    htmlFor={property.id}
                    className="block cursor-pointer"
                  >
                    {formatCurrency(property.purchase_price)}
                  </label>
                </TableCell>
                <TableCell>
                  <label 
                    htmlFor={property.id}
                    className="block cursor-pointer"
                  >
                    {formatCurrency(property.current_value)}
                  </label>
                </TableCell>
                <TableCell>
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
            ))}
          </TableBody>
        </Table>
      </RadioGroup>
    </div>
  )
}