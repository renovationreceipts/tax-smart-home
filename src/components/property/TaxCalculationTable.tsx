
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TaxTableRow } from "./TaxTableRow"
import { formatCurrency } from "@/lib/utils"
import { useTaxCalculations } from "@/hooks/useTaxCalculations"
import type { Project } from "@/hooks/useProjects"

interface TaxCalculationTableProps {
  property: any
  projects: Project[]
  onProjectClick?: (project: Project) => void
}

export function TaxCalculationTable({ property, projects, onProjectClick }: TaxCalculationTableProps) {
  const {
    totalProjectCosts,
    adjustedCostBasis,
    taxableGainWithBasis,
    taxableGainWithoutBasis,
  } = useTaxCalculations({ property, projects })

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Project Details</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Completion Date</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No projects added yet
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow 
                  key={project.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onProjectClick?.(project)}
                >
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    {new Date(project.completion_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(project.cost)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${project.qualifies_for_basis ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm">
                        {project.qualifies_for_basis ? 'Qualifies' : 'Does Not Qualify'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Tax Impact</h3>
        <Table>
          <TableBody>
            <TaxTableRow
              label="Original Purchase Price"
              value={property.purchase_price}
            />
            <TaxTableRow
              label="Total Cost Basis Improvements"
              value={totalProjectCosts}
              className="border-t"
            />
            <TaxTableRow
              label="New Cost Basis"
              value={adjustedCostBasis}
              isTotal
            />
            <TaxTableRow
              label="Current Value"
              value={property.current_value}
              className="border-t"
            />
            <TaxTableRow
              label="Taxable Gain (with improvements)"
              value={taxableGainWithBasis}
              isHighlighted
            />
            <TaxTableRow
              label="Taxable Gain (without improvements)"
              value={taxableGainWithoutBasis}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
