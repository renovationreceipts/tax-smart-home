
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, X, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface ProjectSuccessModalProps {
  open: boolean
  onClose: () => void
  project: {
    id: string
    name: string
    cost: number
    qualifies_for_basis: boolean
    tax_credits_eligible: boolean
    insurance_reduction_eligible: boolean
  } | null
  propertyId?: string
}

export function ProjectSuccessModal({ 
  open, 
  onClose,
  project,
  propertyId
}: ProjectSuccessModalProps) {
  if (!project) return null

  const handleViewDetails = () => {
    if (project.id && propertyId) {
      // Update the URL to match the route defined in main.tsx for ViewProject
      window.location.href = `/project/view/${propertyId}/${project.id}`
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center">
            <DialogTitle className="text-xl font-bold">Project Added Successfully!</DialogTitle>
          </div>
          <p className="text-gray-500 text-sm mt-1 pb-4 border-b border-gray-200">We've analyzed your project for potential savings</p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{project.name}</h3>
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold">{formatCurrency(project.cost)}</span>
              {project.qualifies_for_basis && (
                <Badge className="bg-green-500 hover:bg-green-600">Qualifies</Badge>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              <div>
                <p className="font-medium">Added to Project Vault</p>
                <p className="text-sm text-gray-500">Your project is stored securely for future documentation needs</p>
              </div>
            </div>

            <div className="flex gap-3">
              {project.qualifies_for_basis ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <X className="h-5 w-5 text-gray-400 shrink-0" />
              )}
              <div>
                <p className="font-medium">IRS Cost Basis Status</p>
                <p className="text-sm text-gray-500">
                  {project.qualifies_for_basis 
                    ? "This project can be added to your home's cost basis"
                    : "This project does not qualify for cost basis adjustment"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {project.tax_credits_eligible ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <X className="h-5 w-5 text-gray-400 shrink-0" />
              )}
              <div>
                <p className="font-medium">Tax Credit Status</p>
                <p className="text-sm text-gray-500">
                  {project.tax_credits_eligible 
                    ? "This project qualifies for tax credits"
                    : "This project does not qualify for tax credits"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {project.insurance_reduction_eligible ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <X className="h-5 w-5 text-gray-400 shrink-0" />
              )}
              <div>
                <p className="font-medium">Insurance Savings Status</p>
                <p className="text-sm text-gray-500">
                  {project.insurance_reduction_eligible 
                    ? "This project qualifies for insurance savings"
                    : "This project does not qualify for insurance savings"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={handleViewDetails}
              variant="default"
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Project Details
            </Button>
            <Button 
              onClick={onClose}
              variant="ghost" 
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
