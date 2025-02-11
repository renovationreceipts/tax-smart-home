
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

interface PropertyFormActionsProps {
  isEditing: boolean
  onCancel: () => void
}

export function PropertyFormActions({ isEditing, onCancel }: PropertyFormActionsProps) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleDeleteProperty = async () => {
    try {
      const pathSegments = window.location.pathname.split('/')
      const propertyId = pathSegments[pathSegments.length - 1]
      
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (error) throw error

      toast({
        title: "Property Deleted",
        description: "The property and all associated projects have been successfully removed from your account.",
      })

      navigate('/account')
    } catch (error) {
      console.error('Error deleting property:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete property. Please try again.",
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDeleteProperty}
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
          {isEditing ? "Update Property" : "Add Property"}
        </Button>
      </div>
    </div>
  )
}
