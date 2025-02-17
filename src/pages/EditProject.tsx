
import { useNavigate, useParams } from "react-router-dom"
import { ProjectForm } from "@/components/project/ProjectForm"
import { useProjects } from "@/hooks/useProjects"

export default function EditProject() {
  const navigate = useNavigate()
  const { propertyId, id } = useParams()
  const { data: projects = [] } = useProjects(propertyId || null)
  const project = id ? projects.find(p => p.id === id) : null

  if (!propertyId) {
    navigate("/account")
    return null
  }

  const handleNavigateBack = () => {
    // Scroll to top before navigation
    window.scrollTo(0, 0)
    
    navigate(`/account?propertyId=${propertyId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProjectForm
        propertyId={propertyId}
        project={project}
        onCancel={handleNavigateBack}
        onSuccess={handleNavigateBack}
      />
    </div>
  )
}
