
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
import { useState, useEffect } from "react"
import { useFormPersistence } from "@/hooks/useFormPersistence"

interface ProjectFormProps {
  propertyId: string
  project?: Project | null
  onSuccess: (project: { 
    id: string
    name: string
    cost: number
    qualifies_for_basis: boolean
    tax_credits_eligible: boolean
    insurance_reduction_eligible: boolean
  }) => void
  onCancel: () => void
}

export function ProjectForm({ propertyId, project, onSuccess, onCancel }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionPhase, setSubmissionPhase] = useState<'adding' | 'analyzing' | 'saving'>('adding')
  
  console.log("ProjectForm - Project data:", project)
  console.log("ProjectForm - Project ID:", project?.id)

  // Generate a unique storage key for this form
  const formStorageKey = project?.id 
    ? `project_form_${propertyId}_${project.id}` 
    : `project_form_new_${propertyId}`

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

  // Use form persistence hook - exclude file fields
  const { clearPersistedData } = useFormPersistence(
    form,
    formStorageKey,
    true, // always persist
    ['beforePhotos', 'afterPhotos', 'receipts'] // exclude file fields
  )

  // Reset form when component mounts with no project
  useEffect(() => {
    if (!project) {
      form.reset({
        name: "",
        description: "",
        cost: "",
        completion_date: new Date(),
        builder_name: "",
        builder_url: "",
        beforePhotos: null,
        afterPhotos: null,
        receipts: null,
      })
    }
  }, [form])

  // Reset form when project data changes
  useEffect(() => {
    if (project) {
      form.reset({
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
      })
    }
  }, [project, form])

  const { onSubmit: submitProject } = useProjectSubmit({ 
    propertyId, 
    project, 
    onSuccess: (data) => {
      const successData = {
        id: data.id,
        name: data.name,
        cost: data.cost,
        qualifies_for_basis: data.qualifies_for_basis || false,
        tax_credits_eligible: data.tax_credits_eligible || false,
        insurance_reduction_eligible: data.insurance_reduction_eligible || false
      }
      // Clear persisted data on successful submission
      clearPersistedData()
      onSuccess(successData)
    },
    onPhaseChange: setSubmissionPhase
  })

  const handleSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true)
    setSubmissionPhase('adding')
    try {
      await submitProject(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    // Clear persisted data when user explicitly cancels
    clearPersistedData()
    onCancel()
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={handleCancel}
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
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              projectId={project?.id}
              submissionPhase={submissionPhase}
            />
          </form>
        </Form>
      </div>
    </>
  )
}
