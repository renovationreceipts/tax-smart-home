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
  
  // Only consider id if it's a valid UUID and not 'edit'
  const isValidId = id && id !== 'edit' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  const property = isValidId ? properties.find(p => p.id === id) : undefined

  const handleSuccess = () => {
    // If we're editing an existing property, use that ID
    // Otherwise use the current selected property from the query params
    const propertyId = isValidId ? id : searchParams.get("propertyId")
    
    // Scroll to top before navigation
    window.scrollTo(0, 0)
    
    navigate(`/account${propertyId ? `?propertyId=${propertyId}` : ''}`)
  }

  // Transform the property data to ensure lived_in_property_2_of_5_years has a boolean value
  const transformedProperty = property ? {
    ...property,
    lived_in_property_2_of_5_years: property.lived_in_property_2_of_5_years ?? true
  } : undefined

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/account")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      <PropertyForm
        property={transformedProperty}
        propertyId={isValidId ? id : undefined}
        onCancel={() => handleSuccess()}
        onSuccess={() => handleSuccess()}
      />
    </div>
  )
}
