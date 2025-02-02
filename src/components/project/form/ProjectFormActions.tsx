import { Button } from "@/components/ui/button"

interface ProjectFormActionsProps {
  isEditing: boolean
  onCancel: () => void
}

export function ProjectFormActions({ isEditing, onCancel }: ProjectFormActionsProps) {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update Project" : "Add Project"}
      </Button>
    </div>
  )
}