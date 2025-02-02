import { PropertyForm } from "@/components/PropertyForm"
import { PropertyList } from "@/components/property/PropertyList"
import { EmptyPropertyState } from "@/components/property/EmptyPropertyState"
import { useProperties } from "@/hooks/useProperties"
import { useEffect } from "react"

interface PropertySectionProps {
  selectedPropertyId: string | null
  setSelectedPropertyId: (id: string) => void
  showPropertyForm: boolean
  setShowPropertyForm: (show: boolean) => void
  propertyToEdit: any
  setPropertyToEdit: (property: any) => void
}

export function PropertySection({ 
  selectedPropertyId,
  setSelectedPropertyId,
  showPropertyForm,
  setShowPropertyForm,
  propertyToEdit,
  setPropertyToEdit
}: PropertySectionProps) {
  const { data: properties = [], refetch: refetchProperties } = useProperties()

  // Auto-select the first property when properties are loaded
  useEffect(() => {
    if (properties.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(properties[0].id)
    }
  }, [properties, selectedPropertyId, setSelectedPropertyId])

  const handleEditProperty = (property: any) => {
    setPropertyToEdit(property)
    setShowPropertyForm(true)
  }

  if (showPropertyForm) {
    return (
      <PropertyForm 
        property={propertyToEdit}
        onCancel={() => {
          setShowPropertyForm(false)
          setPropertyToEdit(null)
        }}
        onSuccess={() => {
          setShowPropertyForm(false)
          setPropertyToEdit(null)
          refetchProperties()
        }}
      />
    )
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
      </div>

      {properties.length === 0 ? (
        <EmptyPropertyState onAddProperty={() => setShowPropertyForm(true)} />
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