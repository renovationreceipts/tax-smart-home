
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProjectHeaderProps {
  projectName: string
  propertyId: string
  projectId: string
  onBack: () => void
}

export function ProjectHeader({ projectName, propertyId, projectId, onBack }: ProjectHeaderProps) {
  const { toast } = useToast()

  const handleExportClick = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade to premium to export your project records.",
      variant: "default",
    })
  }

  const handleEditProject = () => {
    window.location.href = `/project/edit/${propertyId}/${projectId}`
  }

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <h1 className="text-2xl font-semibold">{projectName}</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleExportClick}
            className="flex-1 sm:flex-none border-gray-300"
          >
            <Lock className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={handleEditProject}
            className="flex-1 sm:flex-none"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
        </div>
      </div>
    </div>
  )
}
