import { ProjectsSection } from "@/components/account/ProjectsSection"
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable"
import { ProjectForm } from "@/components/project/ProjectForm"
import { useProjects } from "@/hooks/useProjects"
import { DollarSign } from "lucide-react"
import type { Project } from "@/hooks/useProjects"

interface ProjectAndTaxSectionProps {
  selectedPropertyId: string | null
  selectedProperty: any
  showProjectForm: boolean
  setShowProjectForm: (show: boolean) => void
  projectToEdit: Project | null
  setProjectToEdit: (project: Project | null) => void
}

export function ProjectAndTaxSection({
  selectedPropertyId,
  selectedProperty,
  showProjectForm,
  setShowProjectForm,
  projectToEdit,
  setProjectToEdit
}: ProjectAndTaxSectionProps) {
  const { data: projects = [], refetch: refetchProjects } = useProjects(selectedPropertyId)

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project)
    setShowProjectForm(true)
  }

  if (showProjectForm && selectedPropertyId) {
    return (
      <ProjectForm
        propertyId={selectedPropertyId}
        project={projectToEdit}
        onCancel={() => {
          setShowProjectForm(false)
          setProjectToEdit(null)
        }}
        onSuccess={() => {
          setShowProjectForm(false)
          setProjectToEdit(null)
          refetchProjects()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <ProjectsSection 
        propertyId={selectedPropertyId}
        projects={projects}
        onAddProject={() => setShowProjectForm(true)}
        onEditProject={handleEditProject}
      />

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold">Tax Calculation</h3>
          <DollarSign className="h-5 w-5 text-gray-500" />
        </div>
        <p className="text-gray-600 text-sm mb-4">
          {!selectedProperty 
            ? "Select a property to view detailed tax calculations and potential savings."
            : "Get automated tax calculations based on your property improvements and expenses."
          }
        </p>
        <TaxCalculationTable 
          property={selectedProperty}
          projects={projects}
        />
      </div>
    </div>
  )
}