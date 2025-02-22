
import { useNavigate, useParams } from "react-router-dom"
import { ProjectForm } from "@/components/project/ProjectForm"
import { useProjects } from "@/hooks/useProjects"
import { useState } from "react"
import { ProjectSuccessModal } from "@/components/project/ProjectSuccessModal"
import { Loader2 } from "lucide-react"

export default function EditProject() {
  const navigate = useNavigate()
  const { propertyId, id } = useParams()
  const { data: projects = [], isLoading } = useProjects(propertyId || null)
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

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading project...</span>
        </div>
      </div>
    )
  }

  // If we have an ID but no project found after loading, redirect back
  if (id && !project && !isLoading) {
    navigate(`/account?propertyId=${propertyId}`)
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
