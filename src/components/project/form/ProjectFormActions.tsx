
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4">
      {isEditing && (
        <div className="order-2 sm:order-none">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="w-full sm:w-auto text-[#ea384c] hover:bg-[#ea384c]/10 border-2 border-[#ea384c]"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this project? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => document.querySelector("button[data-dismiss]")?.click()}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDeleteProject}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
      <div className="flex gap-4 order-1 sm:order-none sm:ml-auto">
        <Button variant="outline" type="button" onClick={onCancel} className="flex-1 sm:flex-none">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 sm:flex-none">
          {isEditing ? "Update Project" : "Add Project"}
        </Button>
      </div>
    </div>
  )
}
