import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProjectsSection() {
  const { toast } = useToast()

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Projects</h3>
        </div>
        <Button 
          onClick={() => toast({
            title: "Not implemented yet",
            description: "Project creation functionality is coming soon.",
          })}
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>
      <p className="text-gray-600 text-sm">
        Track home improvement projects for each property. These will be used
        for tax calculations.
      </p>
    </div>
  )
}