
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { ProjectFormHeader } from "./form/ProjectFormHeader"
import { ProjectBasicFields } from "./form/ProjectBasicFields"
import { ProjectFileFields } from "./form/ProjectFileFields"
import { ProjectBuilderFields } from "./form/ProjectBuilderFields"
import { ProjectFormActions } from "./form/ProjectFormActions"
import { projectFormSchema, type ProjectFormValues } from "./form/ProjectFormTypes"
import { useProjectSubmit } from "@/hooks/useProjectSubmit"
import type { Project } from "@/hooks/useProjects"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

interface ProjectFormProps {
  propertyId: string
  project?: Project | null
  onSuccess: () => void
  onCancel: () => void
}

export function ProjectForm({ propertyId, project, onSuccess, onCancel }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  console.log("ProjectForm - Project data:", project)
  console.log("ProjectForm - Project ID:", project?.id)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project ? {
      name: project.name,
      description: project.description || "",
      cost: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(project.cost),
      completion_date: new Date(project.completion_date),
      builder_name: project.builder_name || "",
      builder_url: project.builder_url || "",
      beforePhotos: null,
      afterPhotos: null,
      receipts: null,
    } : {
      name: "",
      description: "",
      cost: "",
      completion_date: new Date(),
      builder_name: "",
      builder_url: "",
      beforePhotos: null,
      afterPhotos: null,
      receipts: null,
    },
  })

  const { onSubmit } = useProjectSubmit({ propertyId, project, onSuccess })

  const handleSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Account
        </Button>
      </div>
      <div className="space-y-6 p-8 bg-white rounded-lg shadow-sm border max-w-4xl mx-auto">
        <ProjectFormHeader isEditing={!!project} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <ProjectBasicFields form={form} />
            <ProjectBuilderFields form={form} />
            <ProjectFileFields form={form} projectId={project?.id} />
            <ProjectFormActions 
              isEditing={!!project} 
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              projectId={project?.id}
            />
          </form>
        </Form>
      </div>
    </>
  )
}
