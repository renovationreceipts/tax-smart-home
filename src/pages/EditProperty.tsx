
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { PropertyForm } from "@/components/PropertyForm"
import { useProperties } from "@/hooks/useProperties"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditProperty() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { data: properties = [] } = useProperties()
  const property = id ? properties.find(p => p.id === id) : undefined

  const handleSuccess = () => {
    // If we're editing an existing property, use that ID
    // Otherwise use the current selected property from the query params
    const propertyId = id || searchParams.get("propertyId")
    navigate(`/account${propertyId ? `?propertyId=${propertyId}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/account")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Account
        </Button>
      </div>
      <PropertyForm
        property={property}
        onCancel={() => handleSuccess()}
        onSuccess={() => handleSuccess()}
      />
    </div>
  )
}
