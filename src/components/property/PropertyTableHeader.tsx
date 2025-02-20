
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PropertyTableHeader() {
  return (
    <TableHeader className="hidden sm:table-header-group">
      <TableRow>
        <TableHead>Property Name</TableHead>
        <TableHead>Address</TableHead>
        <TableHead>Purchase Price</TableHead>
        <TableHead>Current Value</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  )
}
