
import { UseFormReturn } from "react-hook-form"
import { MoneyField } from "@/components/property/MoneyField"
import { ProjectNameField } from "./fields/ProjectNameField"
import { ProjectDescriptionField } from "./fields/ProjectDescriptionField"
import type { ProjectFormValues } from "./ProjectFormTypes"
import { ProjectDateField } from "./ProjectDateField"

interface ProjectBasicFieldsProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectBasicFields({ form }: ProjectBasicFieldsProps) {
  return (
    <>
      <ProjectNameField form={form} />
      <ProjectDescriptionField form={form} />
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
        <MoneyField
          form={form}
          name="cost"
          label="Project Cost"
        />
        <div className="sm:order-none order-last">
          <ProjectDateField form={form} />
        </div>
      </div>
    </>
  )
}
