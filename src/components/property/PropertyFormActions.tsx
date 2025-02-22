
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
  DialogClose,
} from "@/components/ui/dialog"
import { useState } from "react"

interface PropertyFormActionsProps {
  isEditing: boolean
  propertyId?: string
  onCancel: () => void
}

export function PropertyFormActions({ isEditing, propertyId, onCancel }: PropertyFormActionsProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)

  // Only show delete button if we're editing and have a valid UUID
  const showDeleteButton = isEditing && propertyId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(propertyId)

  const handleDeleteProperty = async () => {
    try {
      // Validate propertyId is a valid UUID
      if (!propertyId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(propertyId)) {
        throw new Error("Invalid property ID format")
      }

      setIsDeleting(true)
      console.log('Deleting property:', propertyId)
      
      // First delete associated projects
      const { error: projectsError } = await supabase
        .from('projects')
        .delete()
        .eq('property_id', propertyId)

      if (projectsError) {
        console.error('Error deleting projects:', projectsError)
        throw projectsError
      }

      // Then delete the property
      const { error: propertyError } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (propertyError) {
        console.error('Error deleting property:', propertyError)
        throw propertyError
      }

      toast({
        title: "Property Deleted",
        description: "The property and all associated projects have been successfully removed.",
      })

      navigate('/account')
    } catch (error) {
      console.error('Error in handleDeleteProperty:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete property. Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-8 pt-4">
      {showDeleteButton && (
        <div className="order-2 sm:order-none">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="w-full sm:w-auto text-[#ea384c] hover:bg-[#ea384c]/10 border-2 border-[#ea384c]"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Property
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Property</DialogTitle>
                <DialogDescription className="pt-2">
                  Are you sure you want to delete this property? This action cannot be undone.
                  <p className="mt-2 font-semibold text-destructive">
                    Warning: Deleting this property will also delete all projects associated with it.
                  </p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col gap-4 sm:flex-row">
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDeleteProperty}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" type="button" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </DialogClose>
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
          {isEditing ? "Update Property" : "Add Property"}
        </Button>
      </div>
    </div>
  )
}
