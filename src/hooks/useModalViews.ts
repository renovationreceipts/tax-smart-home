
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useModalViews(propertyId: string | null) {
  const queryClient = useQueryClient()

  const { data: modalView } = useQuery({
    queryKey: ['modalViews', propertyId],
    queryFn: async () => {
      // Don't query if propertyId is null or 'edit'
      if (!propertyId || propertyId === 'edit') return null

      const { data, error } = await supabase
        .from('property_modal_views')
        .select('*')
        .eq('property_id', propertyId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching modal view:', error)
        throw error
      }

      return data
    },
    enabled: !!propertyId && propertyId !== 'edit'
  })

  const setModalViewed = useMutation({
    mutationFn: async () => {
      if (!propertyId || propertyId === 'edit') return

      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('User not authenticated')

      const { data: existingView } = await supabase
        .from('property_modal_views')
        .select('id')
        .eq('property_id', propertyId)
        .maybeSingle()

      if (existingView) {
        // Update existing record
        const { error } = await supabase
          .from('property_modal_views')
          .update({ tax_savings_modal_viewed: true })
          .eq('property_id', propertyId)
          .eq('user_id', user.user.id)

        if (error) throw error
      } else {
        // Insert new record
        const { error } = await supabase
          .from('property_modal_views')
          .insert({
            property_id: propertyId,
            user_id: user.user.id,
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
