
import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Project } from "@/hooks/useProjects"
import { useProperties } from "@/hooks/useProperties"
import { ProjectTypeExamples } from "@/components/project/ProjectTypeExamples"

interface ProjectsSectionProps {
  propertyId: string | null
  projects: Project[]
  onAddProject: () => void
  onEditProject?: (project: Project) => void
}

export function ProjectsSection({ propertyId, projects, onAddProject, onEditProject }: ProjectsSectionProps) {
  const { data: properties = [] } = useProperties()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (!propertyId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Projects</h3>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {properties.length === 0 
            ? "Add a property first and then you can start tracking your improvement projects"
            : "Select a property to view and manage its projects"
          }
        </p>
        {properties.length === 0 && <ProjectTypeExamples />}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Projects</h3>
        </div>
        <Button 
          onClick={onAddProject}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-600 text-sm">
          No projects added yet. Add your first project to start tracking improvements.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader className="hidden sm:table-header-group">
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Completion Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow 
                  key={project.id}
                  onClick={() => onEditProject?.(project)}
                  className="cursor-pointer hover:bg-muted/50 flex flex-col sm:table-row"
                >
                  <TableCell className="font-medium py-2 sm:py-4">{project.name}</TableCell>
                  <TableCell className="py-2 sm:py-4">{project.description}</TableCell>
                  <TableCell className="py-2 sm:py-4 sm:text-right">
                    <span className="font-medium sm:hidden">Cost: </span>
                    {formatCurrency(project.cost)}
                  </TableCell>
                  <TableCell className="py-2 sm:py-4 sm:text-right">
                    <span className="font-medium sm:hidden">Completion Date: </span>
                    {formatDate(project.completion_date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
