import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ProjectFormHeader } from "./form/ProjectFormHeader"
import { ProjectBasicFields } from "./form/ProjectBasicFields"
import { ProjectDateField } from "./form/ProjectDateField"
import { ProjectFileFields } from "./form/ProjectFileFields"
import { ProjectBuilderFields } from "./form/ProjectBuilderFields"
import { ProjectFormActions } from "./form/ProjectFormActions"
import { projectFormSchema, type ProjectFormValues } from "./form/ProjectFormTypes"

interface ProjectFormProps {
  propertyId: string
  onSuccess: () => void
  onCancel: () => void
}

export function ProjectForm({ propertyId, onSuccess, onCancel }: ProjectFormProps) {
  const { toast } = useToast()
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      cost: "",
      completion_date: new Date(),
      builder_name: "",
      builder_url: "",
    },
  })

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

      // Upload files if they exist
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

      toast({
        title: "Success",
        description: "Project has been added successfully.",
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

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
      <ProjectFormHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ProjectBasicFields form={form} />
          <ProjectDateField form={form} />
          <ProjectFileFields form={form} />
          <ProjectBuilderFields form={form} />
          <ProjectFormActions onCancel={onCancel} />
        </form>
      </Form>
    </div>
  )
}