import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

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
        description: "The property has been successfully removed from your account.",
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
    <div className="flex justify-between gap-4 pt-4">
      {isEditing && (
        <Button
          variant="destructive"
          type="button"
          onClick={handleDeleteProperty}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Property
        </Button>
      )}
      <div className="flex gap-4 ml-auto">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Update Property" : "Add Property"}
        </Button>
      </div>
    </div>
  )
}