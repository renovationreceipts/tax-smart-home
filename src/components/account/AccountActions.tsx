import { Button } from "@/components/ui/button"
import { Plus, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface AccountActionsProps {
  onAddProperty: () => void
}

export function AccountActions({ onAddProperty }: AccountActionsProps) {
  const navigate = useNavigate()

  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        onClick={() => navigate("/profile")}
      >
        <User className="h-4 w-4 mr-2" />
        Profile
      </Button>
      <Button onClick={onAddProperty}>
        <Plus className="h-4 w-4 mr-2" />
        Add Property
      </Button>
    </div>
  )
}