
import { FileText, Plus, Wrench, ClipboardList } from "lucide-react"
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

  if (!propertyId || properties.length === 0) {
    return null
  }

  const EmptyState = () => (
    <div className="space-y-8">
      <div className="bg-gray-50 rounded-lg p-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <Wrench className="h-5 w-5 text-[#0090FF]" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Step 2: Track your renovations</h2>
            <p className="text-gray-600 mt-1">
              See if your renovations qualify for tax savings using our IRS-GPT analyzer.
            </p>
          </div>
        </div>
        <Button 
          onClick={onAddProject} 
          className="sm:!variant-default border border-primary text-white hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <ProjectTypeExamples />
    </div>
  )

  const MobileProjectCard = ({ project }: { project: Project }) => (
    <div 
      className="border-b last:border-b-0 py-6 first:pt-2 last:pb-2 px-4 space-y-4"
      onClick={() => onEditProject?.(project)}
    >
      <h3 className="text-xl font-bold">{project.name}</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600">Project Cost:</span>
          <span className="font-medium">{formatCurrency(project.cost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Completion Date:</span>
          <span className="font-medium">{formatDate(project.completion_date)}</span>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="w-full text-primary hover:text-primary"
        onClick={(e) => {
          e.stopPropagation()
          onEditProject?.(project)
        }}
      >
        View Project
      </Button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="pb-4 sm:pb-0 border-b sm:border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#0090FF]" />
            <h3 className="text-lg font-semibold">Projects</h3>
          </div>
          {projects.length > 0 && (
            <Button 
              onClick={onAddProject}
              size="sm"
              variant="ghost"
              className="border bg-white text-[#0090FF] border-[#0090FF] hover:bg-white/90 hover:text-[#0090FF] hover:border-[#0090FF]"
            >
              <Plus className="h-4 w-4 mr-2 text-[#0090FF]" />
              <span className="hidden sm:inline">Add Project</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="mt-4">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-4">
          <div className="block sm:hidden -mx-6">
            {projects.map((project) => (
              <MobileProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="hidden sm:block overflow-x-auto">
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
                  <TableRow 
                    key={project.id}
                    onClick={() => onEditProject?.(project)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
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
      )}
    </div>
  )
}
