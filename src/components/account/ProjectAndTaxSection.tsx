
import { useNavigate } from "react-router-dom"
import { ProjectsSection } from "@/components/account/ProjectsSection"
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable"
import { TaxFormGenerator } from "@/components/property/tax-form/TaxFormGenerator"
import { useProjects } from "@/hooks/useProjects"
import { DollarSign } from "lucide-react"
import type { Project } from "@/hooks/useProjects"

interface ProjectAndTaxSectionProps {
  selectedPropertyId: string | null
  selectedProperty: any
}

export function ProjectAndTaxSection({
  selectedPropertyId,
  selectedProperty,
}: ProjectAndTaxSectionProps) {
  const navigate = useNavigate()
  const { data: projects = [] } = useProjects(selectedPropertyId)

  const handleEditProject = (project: Project) => {
    navigate(`/project/edit/${selectedPropertyId}/${project.id}`)
  }

  return (
    <div className="space-y-6">
      <ProjectsSection 
        propertyId={selectedPropertyId}
        projects={projects}
        onAddProject={() => navigate(`/project/edit/${selectedPropertyId}`)}
        onEditProject={handleEditProject}
      />

      {selectedProperty && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">Tax Calculation</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            If you sold your property today...
          </p>
          <TaxCalculationTable 
            property={selectedProperty}
            projects={projects}
          />
        </div>
      )}

      {selectedProperty && (
        <TaxFormGenerator 
          property={selectedProperty}
          projects={projects}
        />
      )}
    </div>
  )
}
