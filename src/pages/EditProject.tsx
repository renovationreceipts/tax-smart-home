
import { useNavigate, useParams } from "react-router-dom"
import { ProjectForm } from "@/components/project/ProjectForm"
import { useProjects, useProjectLimitCheck } from "@/hooks/useProjects"
import { useProperties } from "@/hooks/useProperties"
import { useState, useEffect } from "react"
import { ProjectSuccessModal } from "@/components/project/ProjectSuccessModal"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { usePremiumStatus } from "@/hooks/usePremiumStatus"
import { PremiumModal } from "@/components/premium/PremiumModal"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditProject() {
  const navigate = useNavigate()
  const { propertyId, id } = useParams()
  const { data: projects = [], isLoading, isError } = useProjects(propertyId || null)
  const { data: properties = [] } = useProperties()
  const project = id ? projects.find(p => p.id === id) : null
  const [successProject, setSuccessProject] = useState<{
    name: string
    cost: number
    qualifies_for_basis: boolean
    tax_credits_eligible: boolean
    insurance_reduction_eligible: boolean
  } | null>(null)
  const { isPremium } = usePremiumStatus()
  const { hasReachedLimit, projectsCount } = useProjectLimitCheck()
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const isEditing = !!project
  
  // Add formKey state to force form remount
  const [formKey, setFormKey] = useState(Date.now())

  useEffect(() => {
    // If not editing and free tier limit reached, show premium modal
    if (!isLoading && !isEditing && !isPremium && hasReachedLimit) {
      setIsPremiumModalOpen(true)
    }
  }, [isLoading, isEditing, isPremium, hasReachedLimit])

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
  
  // If premium modal should be shown and not editing, render just that with back button
  if (isPremiumModalOpen && !isEditing) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(`/account?propertyId=${propertyId}`, { replace: true })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Premium Subscription Required</h2>
            <p className="text-gray-600 mb-8">
              You've reached the limit of {projectsCount} projects on the free plan.
              Upgrade to premium to add unlimited projects.
            </p>
            <Button 
              onClick={() => setIsPremiumModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600"
            >
              View Premium Options
            </Button>
          </div>
          
          <PremiumModal
            open={isPremiumModalOpen}
            onClose={() => navigate(`/account?propertyId=${propertyId}`, { replace: true })}
            propertyCount={properties.length}
            projectCount={projectsCount}
          />
        </div>
      </div>
    )
  }

  const handleNavigateBack = () => {
    window.scrollTo(0, 0)
    navigate(`/account?propertyId=${propertyId}`)
  }

  const handleAddAnother = () => {
    setSuccessProject(null)
    setFormKey(Date.now()) // Generate new key to force form remount
    navigate(`/project/edit/${propertyId}?new=${Date.now()}`) // Add timestamp to force fresh route
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
        key={formKey}
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
