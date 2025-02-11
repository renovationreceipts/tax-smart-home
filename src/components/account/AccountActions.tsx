
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AccountActionsProps {
  onAddProperty: () => void
}

export function AccountActions({ onAddProperty }: AccountActionsProps) {
  return (
    <div className="flex gap-4">
      <Button 
        onClick={onAddProperty}
        size="sm"
        variant="ghost"
        className="sm:!variant-default border border-primary text-primary hover:text-primary"
      >
        <Plus className="h-4 w-4 mr-2 text-primary" />
        <span className="hidden sm:inline">Add Property</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </div>
  )
}
