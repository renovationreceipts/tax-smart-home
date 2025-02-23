
import { useNavigate, useParams } from "react-router-dom"
import { ProjectForm } from "@/components/project/ProjectForm"
import { useProjects } from "@/hooks/useProjects"
import { useState } from "react"
import { ProjectSuccessModal } from "@/components/project/ProjectSuccessModal"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function EditProject() {
  const navigate = useNavigate()
  const { propertyId, id } = useParams()
  const { data: projects = [], isLoading, isError } = useProjects(propertyId || null)
  const project = id ? projects.find(p => p.id === id) : null
  const [successProject, setSuccessProject] = useState<{
    name: string
    cost: number
    qualifies_for_basis: boolean
    tax_credits_eligible: boolean
    insurance_reduction_eligible: boolean
  } | null>(null)

  if (!propertyId) {
    navigate("/account")
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error loading project data. Please try again.</div>
      </div>
    )
  }

  if (id && !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Project not found.</div>
      </div>
    )
  }

  const handleNavigateBack = () => {
    // Scroll to top before navigation
    window.scrollTo(0, 0)
    navigate(`/account?propertyId=${propertyId}`)
  }

  const handleAddAnother = () => {
    setSuccessProject(null)
    // Reset form by navigating to new project route
    navigate(`/project/edit/${propertyId}`)
  }

  const handleSuccess = (project: { 
    name: string
    cost: number
    qualifies_for_basis: boolean 
    tax_credits_eligible: boolean
    insurance_reduction_eligible: boolean
  }) => {
    setSuccessProject(project)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProjectForm
        propertyId={propertyId}
        project={project}
        onCancel={handleNavigateBack}
        onSuccess={handleSuccess}
      />
      <ProjectSuccessModal
        open={!!successProject}
        project={successProject}
        onClose={handleNavigateBack}
        onAddAnother={handleAddAnother}
      />
    </div>
  )
}

