
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface ProjectSuccessModalProps {
  open: boolean
  onClose: () => void
  onAddAnother: () => void
  project: {
    name: string
    cost: number
    qualifies_for_basis: boolean
    tax_credits_eligible: boolean
    insurance_reduction_eligible: boolean
  } | null
}

export function ProjectSuccessModal({ 
  open, 
  onClose, 
  project 
}: ProjectSuccessModalProps) {
  const navigate = useNavigate()
  if (!project) return null

  const handleAddAnother = () => {
    // Extract propertyId from the current URL
    const pathSegments = window.location.pathname.split('/')
    const propertyId = pathSegments[3] // Based on the URL pattern /project/edit/:propertyId/:projectId
    
    // Navigate to the new project route for this property
    navigate(`/project/edit/${propertyId}`)
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
              onClick={handleAddAnother} 
              variant="default"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Project
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
