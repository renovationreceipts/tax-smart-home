
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Lock, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface ProjectSuccessModalProps {
  open: boolean
  onClose: () => void
  onAddAnother: () => void
  project: {
    name: string
    cost: number
    qualifies_for_basis: boolean
  } | null
}

export function ProjectSuccessModal({ 
  open, 
  onClose, 
  onAddAnother, 
  project 
}: ProjectSuccessModalProps) {
  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center">
            <DialogTitle className="text-xl font-bold">Project Added Successfully!</DialogTitle>
          </div>
          <p className="text-gray-500 text-sm mt-1">We've analyzed your project for potential savings</p>
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
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              <div>
                <p className="font-medium">IRS Cost Basis Qualifies</p>
                <p className="text-sm text-gray-500">This project can be added to your home's cost basis</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="h-5 w-5 text-gray-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Tax Credit Analysis</p>
                  <Badge variant="secondary" className="text-xs">Premium</Badge>
                </div>
                <p className="text-sm text-gray-500">Upgrade to see potential tax credits for this project</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="h-5 w-5 text-gray-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Insurance Savings</p>
                  <Badge variant="secondary" className="text-xs">Premium</Badge>
                </div>
                <p className="text-sm text-gray-500">Upgrade to see potential insurance discounts</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={onAddAnother} 
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
