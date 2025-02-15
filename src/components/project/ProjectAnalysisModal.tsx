
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/hooks/useProjects"

interface ProjectAnalysisModalProps {
  project: Project | null
  open: boolean
  onClose: () => void
}

export function ProjectAnalysisModal({ project, open, onClose }: ProjectAnalysisModalProps) {
  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{project.name}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Project Cost</p>
            <p className="text-lg font-semibold">{formatCurrency(project.cost)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Tax Basis Analysis</p>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2 items-center mb-2">
                <div className={`w-2 h-2 rounded-full ${project.qualifies_for_basis ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className="font-medium">
                  {project.qualifies_for_basis ? 'Qualifies for Cost Basis' : 'Does Not Qualify for Cost Basis'}
                </p>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap">{project.ai_analysis_result}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
