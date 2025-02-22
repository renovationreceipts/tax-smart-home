
import { Button } from "@/components/ui/button"
import type { Project } from "@/hooks/useProjects"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { Download } from "lucide-react"
import { generateProjectsPDF } from "@/utils/pdfExport"
import { useProjectFiles } from "@/components/project/form/storage-vault/useProjectFiles"
import { useToast } from "@/hooks/use-toast"

interface MobileProjectCardProps {
  projects: Project[]
  totalProjectCosts: number
  onViewProject: (project: Project) => void
}

export function MobileProjectCard({ projects, totalProjectCosts, onViewProject }: MobileProjectCardProps) {
  const { toast } = useToast()
  const projectIds = projects.map(p => p.id)
  const { existingFiles } = useProjectFiles(projectIds[0]) // This hook needs to be updated to handle multiple projects

  const handleExport = () => {
    try {
      const projectFilesMap: { [key: string]: any[] } = {}
      projectIds.forEach(id => {
        projectFilesMap[id] = existingFiles.filter(f => f.project_id === id)
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
    <div className="block sm:hidden -mx-6">
      {projects.map(project => (
        <div 
          key={project.id}
          className="border-b last:border-b-0 py-6 first:pt-2 last:pb-2 px-4"
          onClick={() => onViewProject(project)}
        >
          <h3 className="text-xl font-bold">{project.name}</h3>
          <div className="space-y-1 text-base mt-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Project Cost:</span>
              <span className="font-medium">{formatCurrency(project.cost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completion Date:</span>
              <span className="font-medium">{formatDate(project.completion_date)}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="px-4 py-4 border-t space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold">Total Projects Cost</span>
          <span className="text-base font-semibold">{formatCurrency(totalProjectCosts)}</span>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Export All Projects
        </Button>
      </div>
    </div>
  )
}
