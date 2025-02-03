import { UseFormReturn } from "react-hook-form"
import { MoneyField } from "@/components/property/MoneyField"
import { ProjectNameField } from "./fields/ProjectNameField"
import { ProjectDescriptionField } from "./fields/ProjectDescriptionField"
import type { ProjectFormValues } from "./ProjectFormTypes"

interface ProjectBasicFieldsProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectBasicFields({ form }: ProjectBasicFieldsProps) {
  return (
    <>
      <ProjectNameField form={form} />
      <ProjectDescriptionField form={form} />
      <MoneyField
        form={form}
        name="cost"
        label="Project Cost"
      />
    </>
  )
}