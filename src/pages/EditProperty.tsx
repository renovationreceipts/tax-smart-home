import { useNavigate, useParams } from "react-router-dom"
import { PropertyForm } from "@/components/PropertyForm"
import { useProperties } from "@/hooks/useProperties"

export function EditProperty() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: properties = [] } = useProperties()
  const property = id ? properties.find(p => p.id === id) : undefined

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PropertyForm
        property={property}
        onCancel={() => navigate("/account")}
        onSuccess={() => navigate("/account")}
      />
    </div>
  )
}