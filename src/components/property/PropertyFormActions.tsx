import { Button } from "@/components/ui/button"

interface PropertyFormActionsProps {
  isEditing: boolean
  onCancel: () => void
}

export function PropertyFormActions({ isEditing, onCancel }: PropertyFormActionsProps) {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update Property" : "Add Property"}
      </Button>
    </div>
  )
}