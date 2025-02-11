
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PropertyTableHeaderProps {
  showRadio?: boolean;
}

export function PropertyTableHeader({ showRadio = true }: PropertyTableHeaderProps) {
  return (
    <TableHeader className="hidden sm:table-header-group">
      <TableRow>
        {showRadio && <TableHead className="w-[48px]"></TableHead>}
        <TableHead>Property Name</TableHead>
        <TableHead>Address</TableHead>
        <TableHead>Purchase Price</TableHead>
        <TableHead>Current Value</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  )
}
