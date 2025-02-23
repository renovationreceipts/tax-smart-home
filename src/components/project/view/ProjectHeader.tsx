
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateSingleProjectPDF } from "@/utils/pdfExport"
import { useProjectFiles } from "@/components/project/form/storage-vault/useProjectFiles"

interface ProjectHeaderProps {
  projectName: string
  propertyId: string
  projectId: string
  onBack: () => void
  project: any // Using any temporarily as we'll get the full project type from the parent
}

export function ProjectHeader({ projectName, propertyId, projectId, onBack, project }: ProjectHeaderProps) {
  const { toast } = useToast()
  const { existingFiles } = useProjectFiles(projectId)

  const handleDownload = () => {
    try {
      const doc = generateSingleProjectPDF(project, existingFiles || [])
      doc.save(`${projectName.toLowerCase().replace(/\s+/g, '-')}-records.pdf`)
      
      toast({
        title: "Download Successful",
        description: "Your project records have been downloaded successfully.",
      })
    } catch (error) {
      console.error("Download failed:", error)
      toast({
        title: "Download Failed",
        description: "There was an error downloading your project records. Please try again.",
        variant: "destructive",
      })
    }
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
            size="sm"
            onClick={handleDownload}
            className="flex-1 sm:flex-none border-gray-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
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
