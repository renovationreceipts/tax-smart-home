import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AccountActionsProps {
  onAddProperty: () => void
}

export function AccountActions({ onAddProperty }: AccountActionsProps) {
  return (
    <div className="flex gap-4">
      <Button onClick={onAddProperty}>
        <Plus className="h-4 w-4 mr-2" />
        Add Property
      </Button>
    </div>
  )
}