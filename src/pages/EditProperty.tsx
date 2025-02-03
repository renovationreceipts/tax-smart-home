import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { PropertyForm } from "@/components/PropertyForm"
import { useProperties } from "@/hooks/useProperties"

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
      <PropertyForm
        property={property}
        onCancel={() => handleSuccess()}
        onSuccess={() => handleSuccess()}
      />
    </div>
  )
}
