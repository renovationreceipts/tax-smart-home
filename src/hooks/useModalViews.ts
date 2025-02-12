
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useModalViews(propertyId: string | null) {
  const queryClient = useQueryClient()

  const { data: modalView } = useQuery({
    queryKey: ['modalViews', propertyId],
    queryFn: async () => {
      if (!propertyId) return null

      const { data, error } = await supabase
        .from('property_modal_views')
        .select('*')
        .eq('property_id', propertyId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching modal view:', error)
        throw error
      }

      return data
    },
    enabled: !!propertyId
  })

  const setModalViewed = useMutation({
    mutationFn: async () => {
      if (!propertyId) return

      const { data: existingView } = await supabase
        .from('property_modal_views')
        .select('id')
        .eq('property_id', propertyId)
        .single()

      if (existingView) {
        // Update existing record
        const { error } = await supabase
          .from('property_modal_views')
          .update({ tax_savings_modal_viewed: true })
          .eq('property_id', propertyId)

        if (error) throw error
      } else {
        // Insert new record
        const { error } = await supabase
          .from('property_modal_views')
          .insert({
            property_id: propertyId,
            tax_savings_modal_viewed: true
          })

        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modalViews', propertyId] })
    }
  })

  return {
    modalView,
    setModalViewed
  }
}
