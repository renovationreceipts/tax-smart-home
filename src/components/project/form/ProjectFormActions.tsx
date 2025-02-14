
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate, useLocation } from "react-router-dom"
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
import { useState } from "react"

interface ProjectFormActionsProps {
  isEditing: boolean
  onCancel: () => void
  isSubmitting: boolean
  projectId?: string
}

export function ProjectFormActions({ isEditing, onCancel, isSubmitting, projectId }: ProjectFormActionsProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // Extract propertyId from the URL path
  const propertyId = location.pathname.split('/')[3]

  const handleDeleteProject = async () => {
    try {
      if (!projectId) {
        console.error('No project ID available:', projectId)
        throw new Error('Project ID is required for deletion')
      }

      console.log('Attempting to delete project:', projectId)
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) {
        console.error('Supabase deletion error:', error)
        throw error
      }

      setDialogOpen(false)
      
      toast({
        title: "Project Deleted",
        description: "The project has been successfully removed from your account.",
      })

      // Navigate back to the property page with the correct propertyId
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setDialogOpen(false)}
                >
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
        <Button 
          variant="outline" 
          type="button" 
          onClick={onCancel} 
          className="flex-1 sm:flex-none"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 sm:flex-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            isEditing ? "Update Project" : "Add Project"
          )}
        </Button>
      </div>
    </div>
  )
}
