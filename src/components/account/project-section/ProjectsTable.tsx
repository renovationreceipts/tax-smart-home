
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Project } from "@/hooks/useProjects"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { Download } from "lucide-react"
import { generateProjectsPDF } from "@/utils/pdfExport"
import { useProjectFiles } from "@/components/project/form/storage-vault/useProjectFiles"
import { useToast } from "@/hooks/use-toast"

interface ProjectsTableProps {
  projects: Project[]
  totalProjectCosts: number
  onViewProject: (project: Project) => void
}

export function ProjectsTable({ projects, totalProjectCosts, onViewProject }: ProjectsTableProps) {
  const { toast } = useToast()
  const projectIds = projects.map(p => p.id)
  const { existingFiles } = useProjectFiles(projectIds[0]) // This hook needs to be updated to handle multiple projects

  const handleExport = () => {
    try {
      const projectFilesMap: { [key: string]: ProjectFile[] } = {}
      projectIds.forEach(id => {
        projectFilesMap[id] = existingFiles?.filter(f => f.project_id === id) || []
      })
      
      const doc = generateProjectsPDF(projects, projectFilesMap)
      doc.save("project-records.pdf")
      
      toast({
        title: "Export Successful",
        description: "Your project records have been exported successfully.",
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your project records. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-base">Project Name</TableHead>
            <TableHead className="text-right text-base">Cost</TableHead>
            <TableHead className="text-right text-base">Completion Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => (
            <TableRow 
              key={project.id} 
              onClick={() => onViewProject(project)} 
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="font-medium text-base">{project.name}</TableCell>
              <TableCell className="text-right text-base">{formatCurrency(project.cost)}</TableCell>
              <TableCell className="text-right text-base">{formatDate(project.completion_date)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="border-t">
            <TableCell className="font-semibold text-base">Total Projects Cost</TableCell>
            <TableCell className="text-right font-semibold text-base">{formatCurrency(totalProjectCosts)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleExport()
                }}
                className="ml-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
