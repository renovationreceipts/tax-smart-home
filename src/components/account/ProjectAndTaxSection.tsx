
import { useNavigate } from "react-router-dom"
import { ProjectsSection } from "@/components/account/ProjectsSection"
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable"
import { TaxFormGenerator } from "@/components/property/tax-form/TaxFormGenerator"
import { useProjects } from "@/hooks/useProjects"
import { DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
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

  const TaxPreview = ({ disabled = false }: { disabled?: boolean }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="h-6 w-6 text-[#0090FF]" />
        <h3 className="text-lg font-semibold">Tax Calculation</h3>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex sm:items-start sm:justify-between flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Step 3: View your tax savings</h3>
              <p className="hidden sm:block text-gray-600 mt-1">
                Keep adding your home projects and watch your tax savings add up
              </p>
            </div>
          </div>
          <Button 
            disabled={disabled}
            onClick={() => !disabled && navigate(`/project/edit/${selectedPropertyId}`)}
            className={`shrink-0 ${disabled ? 'bg-[#f3f3f3] text-[#8E9196] hover:bg-[#f3f3f3] hover:text-[#8E9196]' : 'bg-primary text-white hover:bg-primary/90'}`}
          >
            View Savings
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <ProjectsSection 
        propertyId={selectedPropertyId}
        projects={projects}
        onAddProject={() => navigate(`/project/edit/${selectedPropertyId}`)}
        onEditProject={handleEditProject}
      />

      {selectedProperty && <TaxPreview disabled={projects.length === 0} />}
    </div>
  )
}
