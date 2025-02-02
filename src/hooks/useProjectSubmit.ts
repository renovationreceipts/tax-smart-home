import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import type { ProjectFormValues } from "@/components/project/form/ProjectFormTypes"
import type { Project } from "@/hooks/useProjects"

interface UseProjectSubmitProps {
  propertyId: string
  project?: Project | null
  onSuccess: () => void
}

export function useProjectSubmit({ propertyId, project, onSuccess }: UseProjectSubmitProps) {
  const { toast } = useToast()

  const handleFileUpload = async (files: FileList, category: string, projectId: string) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const filePath = `${projectId}/${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        continue
      }

      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_path: filePath,
          file_type: file.type,
          file_category: category,
        })

      if (dbError) {
        console.error('Error saving file metadata:', dbError)
      }
    }
  }

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
          })
          .eq('id', project.id)

        if (error) throw error
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
      }

      toast({
        title: "Success",
        description: `Project has been ${project ? 'updated' : 'added'} successfully.`,
      })
      
      onSuccess()
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