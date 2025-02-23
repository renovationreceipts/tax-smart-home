
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { PropertyForm } from "@/components/PropertyForm"
import { useProperties } from "@/hooks/useProperties"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export default function EditProperty() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const { data: properties = [], isLoading: propertiesLoading } = useProperties()
  
  // Only consider id if it's a valid UUID and not 'edit'
  const isValidId = id && id !== 'edit' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  const property = isValidId ? properties.find(p => p.id === id) : undefined

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate("/login", { replace: true })
        return
      }
      setIsLoading(false)
    }
    
    checkSession()
  }, [navigate])

  const handleSuccess = () => {
    // If we're editing an existing property, use that ID
    // Otherwise use the current selected property from the query params
    const propertyId = isValidId ? id : searchParams.get("propertyId")
    
    // Scroll to top before navigation
    window.scrollTo(0, 0)
    
    navigate(`/account${propertyId ? `?propertyId=${propertyId}` : ''}`, { replace: true })
  }

  if (isLoading || propertiesLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  // If we have a valid ID but no property was found, show an error
  if (isValidId && !property) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/account", { replace: true })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Property Not Found</h2>
            <p className="mt-2 text-gray-600">The property you're trying to edit could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/account", { replace: true })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      <PropertyForm
        property={property}
        propertyId={isValidId ? id : undefined}
        onCancel={() => handleSuccess()}
        onSuccess={() => handleSuccess()}
      />
    </div>
  )
}
