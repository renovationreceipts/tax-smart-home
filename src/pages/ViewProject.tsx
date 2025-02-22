
import { useNavigate, useParams } from "react-router-dom"
import { useProjects } from "@/hooks/useProjects"
import { useProjectFiles } from "@/components/project/form/storage-vault/useProjectFiles"
import { ProjectHeader } from "@/components/project/view/ProjectHeader"
import { ProjectDetails } from "@/components/project/view/ProjectDetails"
import { AssessmentCard } from "@/components/project/view/AssessmentCard"
import { StorageVaultPreview } from "@/components/project/view/StorageVaultPreview"

export default function ViewProject() {
  const navigate = useNavigate()
  const { propertyId, id } = useParams()
  const { data: projects = [] } = useProjects(propertyId || null)
  const project = id ? projects.find(p => p.id === id) : null
  const { existingFiles } = useProjectFiles(id)

  if (!project || !propertyId) {
    return null
  }

  const handleBack = () => {
    navigate(`/account?propertyId=${propertyId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <ProjectHeader
          projectName={project.name}
          propertyId={propertyId}
          projectId={project.id}
          onBack={handleBack}
        />

        <div className="space-y-6">
          <ProjectDetails
            cost={project.cost}
            completionDate={project.completion_date}
            builderName={project.builder_name}
            builderUrl={project.builder_url}
            description={project.description}
          />

          <div className="space-y-4">
            <AssessmentCard
              title="Cost Basis Assessment"
              qualifies={project.qualifies_for_basis}
              analysis={project.ai_analysis_result}
              tooltipContent="This analysis determines if the project can be added to your home's cost basis for tax purposes."
            />

            <AssessmentCard
              title="Tax Credits Assessment"
              qualifies={project.tax_credits_eligible}
              analysis={project.tax_credits_analysis}
              tooltipContent="This analysis identifies potential tax credits available for your improvement project."
            />

            <AssessmentCard
              title="Insurance Premium Assessment"
              qualifies={project.insurance_reduction_eligible}
              analysis={project.insurance_reduction_analysis}
              tooltipContent="This analysis evaluates if your improvement could qualify for insurance premium reductions."
            />
          </div>

          <StorageVaultPreview files={existingFiles} />
        </div>
      </div>
    </div>
  )
}
