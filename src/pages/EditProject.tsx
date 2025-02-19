
import { useNavigate, useParams } from "react-router-dom"
import { ProjectForm } from "@/components/project/ProjectForm"
import { useProjects } from "@/hooks/useProjects"
import { useState } from "react"
import { ProjectSuccessModal } from "@/components/project/ProjectSuccessModal"

export default function EditProject() {
  const navigate = useNavigate()
  const { propertyId, id } = useParams()
  const { data: projects = [] } = useProjects(propertyId || null)
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
