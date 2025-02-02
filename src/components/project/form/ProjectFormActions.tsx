import { Button } from "@/components/ui/button"

interface ProjectFormActionsProps {
  onCancel: () => void
}

export function ProjectFormActions({ onCancel }: ProjectFormActionsProps) {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        Add Project
      </Button>
    </div>
  )
}