import { StorageVaultSection } from "./storage-vault/StorageVaultSection"
import type { UseFormReturn } from "react-hook-form"
import type { ProjectFormValues } from "./ProjectFormTypes"

interface ProjectFileFieldsProps {
  form: UseFormReturn<ProjectFormValues>
  projectId?: string
}

export function ProjectFileFields({ form, projectId }: ProjectFileFieldsProps) {
  return <StorageVaultSection form={form} projectId={projectId} />
}