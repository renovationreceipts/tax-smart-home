
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
  const property = id && id !== 'edit' ? properties.find(p => p.id === id) : undefined

  const handleSuccess = () => {
    // If we're editing an existing property, use that ID
    // Otherwise use the current selected property from the query params
    const propertyId = id && id !== 'edit' ? id : searchParams.get("propertyId")
    
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
          Back to Account
        </Button>
      </div>
      <PropertyForm
        property={transformedProperty}
        onCancel={() => handleSuccess()}
        onSuccess={() => handleSuccess()}
      />
    </div>
  )
}
