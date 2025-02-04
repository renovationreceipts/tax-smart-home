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

interface ProjectFormProps {
  propertyId: string
  project?: Project | null
  onSuccess: () => void
  onCancel: () => void
}

export function ProjectForm({ propertyId, project, onSuccess, onCancel }: ProjectFormProps) {
  console.log("Project data received:", project)

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
    } : {
      name: "",
      description: "",
      cost: "",
      completion_date: new Date(),
      builder_name: "",
      builder_url: "",
    },
  })

  const { onSubmit } = useProjectSubmit({ propertyId, project, onSuccess })

  console.log("Form default values:", form.getValues())

  return (
    <div className="space-y-6 p-8 bg-white rounded-lg shadow-sm border max-w-4xl mx-auto">
      <ProjectFormHeader isEditing={!!project} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ProjectBasicFields form={form} />
          <ProjectFileFields form={form} projectId={project?.id} />
          <ProjectBuilderFields form={form} />
          <ProjectFormActions isEditing={!!project} onCancel={onCancel} />
        </form>
      </Form>
    </div>
  )
}