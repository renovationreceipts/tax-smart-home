
import { TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Project } from "@/hooks/useProjects"

interface AIAnalysisCardProps {
  projectedTaxSavings: number
  projects: Project[]
}

export function AIAnalysisCard({ projectedTaxSavings, projects }: AIAnalysisCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">AI Analysis</h2>
          <p className="text-gray-600 max-w-3xl">
            These projects appear to meet IRS guidelines considered capital improvements that add value 
            and extend the useful life of the property, making them eligible for increasing the cost 
            basis according to IRS guidelines.
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold">{formatCurrency(projectedTaxSavings)}</span>
          </div>
          <div className="text-sm text-gray-500">Future Tax Savings</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Completion Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(project.cost)}</TableCell>
                  <TableCell className="text-right">{formatDate(project.completion_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-3">How Does it Save Me Money?</h2>
        <p className="text-gray-700 leading-relaxed">
          When you sell your home, you may be subject to capital gains tax on the proceeds of the sale. 
          Tracking eligible home improvements carefully can save you money by increasing the cost basis 
          of your property. Proceeds = Sale price - cost basis. Meaning you want your cost basis as high 
          as possible
        </p>
      </div>
    </div>
  )
}
