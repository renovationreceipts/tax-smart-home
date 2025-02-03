import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

interface ProjectFormActionsProps {
  isEditing: boolean
  onCancel: () => void
}

export function ProjectFormActions({ isEditing, onCancel }: ProjectFormActionsProps) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleDeleteProject = async () => {
    try {
      const pathSegments = window.location.pathname.split('/')
      const projectId = pathSegments[pathSegments.length - 1]
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      toast({
        title: "Project Deleted",
        description: "The project has been successfully removed from your account.",
      })

      // Navigate back to the property page
      const propertyId = pathSegments[pathSegments.length - 3]
      navigate(`/account?propertyId=${propertyId}`)
    } catch (error) {
      console.error('Error deleting project:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project. Please try again.",
      })
    }
  }

  return (
    <div className="flex justify-between gap-4 pt-4">
      {isEditing && (
        <Button
          variant="destructive"
          type="button"
          onClick={handleDeleteProject}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Project
        </Button>
      )}
      <div className="flex gap-4 ml-auto">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Update Project" : "Add Project"}
        </Button>
      </div>
    </div>
  )
}