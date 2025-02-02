import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Project } from "@/hooks/useProjects"
import { useProperties } from "@/hooks/useProperties"
import { ProjectForm } from "@/components/project/ProjectForm"

interface ProjectsSectionProps {
  propertyId: string | null
  projects: Project[]
}

export function ProjectsSection({ propertyId, projects }: ProjectsSectionProps) {
  const [showProjectForm, setShowProjectForm] = useState(false)
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

  if (showProjectForm && propertyId) {
    return (
      <ProjectForm
        propertyId={propertyId}
        onCancel={() => setShowProjectForm(false)}
        onSuccess={() => setShowProjectForm(false)}
      />
    )
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
            ? "Add a property first and then you can add projects"
            : "Select a property to view and manage its projects"
          }
        </p>
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
          onClick={() => setShowProjectForm(true)}
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
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Completion Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{formatCurrency(project.cost)}</TableCell>
                  <TableCell>{formatDate(project.completion_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}