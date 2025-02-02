import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TaxCalculationTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Current Home Value</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Purchase Price</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Basis Adjustments</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">New Cost Basis</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Taxable Gain With New Cost Basis</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Taxable Gain Without New Cost Basis</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Tracking Improvements Reduced Your Taxable Capital Gain By</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium text-green-600">Based on Your Tax Rate This Saved You</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}