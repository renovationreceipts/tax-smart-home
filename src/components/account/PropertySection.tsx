import { useNavigate } from "react-router-dom"
import { PropertyList } from "@/components/property/PropertyList"
import { EmptyPropertyState } from "@/components/property/EmptyPropertyState"
import { useProperties } from "@/hooks/useProperties"
import { useEffect } from "react"

interface PropertySectionProps {
  selectedPropertyId: string | null
  setSelectedPropertyId: (id: string) => void
}

export function PropertySection({ 
  selectedPropertyId,
  setSelectedPropertyId,
}: PropertySectionProps) {
  const navigate = useNavigate()
  const { data: properties = [] } = useProperties()

  useEffect(() => {
    if (properties.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(properties[0].id)
    }
  }, [properties, selectedPropertyId, setSelectedPropertyId])

  const handleEditProperty = (property: any) => {
    navigate(`/property/edit/${property.id}`)
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
      </div>

      {properties.length === 0 ? (
        <EmptyPropertyState onAddProperty={() => navigate("/property/edit")} />
      ) : (
        <PropertyList 
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          onPropertySelect={setSelectedPropertyId}
          onEditProperty={handleEditProperty}
        />
      )}
    </div>
  )
}