
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import type { ProjectFormValues } from "@/components/project/form/ProjectFormTypes"
import type { Project } from "@/hooks/useProjects"
import { useFileUpload } from "./project/useFileUpload"
import { analyzeProject } from "./project/useProjectAnalysis"
import { useQueryClient } from "@tanstack/react-query"
import { invalidateProjectsCache } from "./useProjects"

interface UseProjectSubmitProps {
  propertyId: string
  project?: Project | null
  onSuccess: (data: { 
    name: string
    cost: number
    qualifies_for_basis: boolean
    tax_credits_eligible: boolean
    insurance_reduction_eligible: boolean
    description?: string | null
  }) => void
  onPhaseChange?: (phase: 'adding' | 'analyzing' | 'saving') => void
}

export function useProjectSubmit({ propertyId, project, onSuccess, onPhaseChange }: UseProjectSubmitProps) {
  const { toast } = useToast()
  const { handleFileUpload } = useFileUpload()
  const queryClient = useQueryClient()

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to add a project.",
        })
        return
      }

      const numericCost = Number(data.cost.replace(/[^0-9.-]/g, ""))
      
      // Start analysis phase
      onPhaseChange?.('analyzing')
      const analysis = await analyzeProject(data.description || data.name)
      
      // Start saving phase
      onPhaseChange?.('saving')
      
      if (project) {
        const { error } = await supabase
          .from("projects")
          .update({
            name: data.name,
            description: data.description || null,
            cost: numericCost,
            completion_date: format(data.completion_date, "yyyy-MM-dd"),
            builder_name: data.builder_name || null,
            builder_url: data.builder_url || null,
            qualifies_for_basis: analysis.costBasis.qualifies,
            ai_analysis_result: analysis.costBasis.analysis,
            tax_credits_eligible: analysis.taxCredits.qualifies,
            tax_credits_analysis: analysis.taxCredits.analysis,
            insurance_reduction_eligible: analysis.insuranceReduction.qualifies,
            insurance_reduction_analysis: analysis.insuranceReduction.analysis
          })
          .eq('id', project.id)

        if (error) throw error

        const uploadPromises = []
        if (data.beforePhotos?.length) {
          uploadPromises.push(handleFileUpload(data.beforePhotos, 'before_photo', project.id))
        }
        if (data.afterPhotos?.length) {
          uploadPromises.push(handleFileUpload(data.afterPhotos, 'after_photo', project.id))
        }
        if (data.receipts?.length) {
          uploadPromises.push(handleFileUpload(data.receipts, 'receipt', project.id))
        }

        await Promise.all(uploadPromises)

        invalidateProjectsCache(queryClient, propertyId)

        onSuccess({
          name: data.name,
          cost: numericCost,
          qualifies_for_basis: analysis.costBasis.qualifies,
          tax_credits_eligible: analysis.taxCredits.qualifies,
          insurance_reduction_eligible: analysis.insuranceReduction.qualifies,
          description: data.description
        })
      } else {
        const { data: projectData, error } = await supabase
          .from("projects")
          .insert({
            property_id: propertyId,
            user_id: user.id,
            name: data.name,
            description: data.description || null,
            cost: numericCost,
            completion_date: format(data.completion_date, "yyyy-MM-dd"),
            builder_name: data.builder_name || null,
            builder_url: data.builder_url || null,
            qualifies_for_basis: analysis.costBasis.qualifies,
            ai_analysis_result: analysis.costBasis.analysis,
            tax_credits_eligible: analysis.taxCredits.qualifies,
            tax_credits_analysis: analysis.taxCredits.analysis,
            insurance_reduction_eligible: analysis.insuranceReduction.qualifies,
            insurance_reduction_analysis: analysis.insuranceReduction.analysis
          })
          .select()
          .single()

        if (error) throw error

        const uploadPromises = []
        if (data.beforePhotos?.length) {
          uploadPromises.push(handleFileUpload(data.beforePhotos, 'before_photo', projectData.id))
        }
        if (data.afterPhotos?.length) {
          uploadPromises.push(handleFileUpload(data.afterPhotos, 'after_photo', projectData.id))
        }
        if (data.receipts?.length) {
          uploadPromises.push(handleFileUpload(data.receipts, 'receipt', projectData.id))
        }

        await Promise.all(uploadPromises)

        invalidateProjectsCache(queryClient, propertyId)

        onSuccess({
          name: data.name,
          cost: numericCost,
          qualifies_for_basis: analysis.costBasis.qualifies,
          tax_credits_eligible: analysis.taxCredits.qualifies,
          insurance_reduction_eligible: analysis.insuranceReduction.qualifies,
          description: data.description
        })
      }

      toast({
        title: "Success",
        description: `Project has been ${project ? 'updated' : 'added'} successfully.`,
      })
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save project. Please try again.",
      })
    }
  }

  return { onSubmit }
}
