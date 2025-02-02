import { Home, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyPropertyStateProps {
  onAddProperty: () => void
}

export function EmptyPropertyState({ onAddProperty }: EmptyPropertyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Home className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Properties Added Yet
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Get started by adding your first property. You can add multiple
          properties and manage their projects and tax calculations
          individually.
        </p>
        <Button onClick={onAddProperty}>
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Property
        </Button>
      </CardContent>
    </Card>
  )
}