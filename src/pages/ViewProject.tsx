
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjects } from "@/hooks/useProjects"
import { ArrowLeft, Edit, Lock } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export default function ViewProject() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { propertyId, id } = useParams()
  const { data: projects = [] } = useProjects(propertyId || null)
  const project = id ? projects.find(p => p.id === id) : null

  if (!project || !propertyId) {
    return null
  }

  const handleEditProject = () => {
    navigate(`/project/edit/${propertyId}/${project.id}`)
  }

  const handleExportClick = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade to premium to export your project records.",
      variant: "default",
    })
  }

  const handleBack = () => {
    navigate(`/account?propertyId=${propertyId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleExportClick}
                className="flex-1 sm:flex-none border-gray-300"
              >
                <Lock className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={handleEditProject}
                className="flex-1 sm:flex-none"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Project Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Project Cost</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(project.cost)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completion Date</span>
                <span className="font-medium">
                  {format(new Date(project.completion_date), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Builder Name</span>
                <span className="font-medium">
                  {project.builder_name || "Not provided"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Builder Website</span>
                <span className="font-medium">
                  {project.builder_url ? (
                    <a 
                      href={project.builder_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {project.builder_url}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </span>
              </div>
              {project.description && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* IRS-GPT Assessment Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>IRS-GPT Assessment</CardTitle>
              {project.qualifies_for_basis && (
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Eligible
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {project.ai_analysis_result || "No assessment available."}
              </p>
            </CardContent>
          </Card>

          {/* Storage Vault Card */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Vault</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* We'll implement the storage vault view here */}
                <div className="min-h-[100px] p-4 border rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                  No before photos uploaded
                </div>
                <div className="min-h-[100px] p-4 border rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                  No after photos uploaded
                </div>
                <div className="min-h-[100px] p-4 border rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                  No receipts uploaded
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
