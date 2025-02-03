import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AccountActions } from "@/components/account/AccountActions"
import { PropertySection } from "@/components/account/PropertySection"
import { ProjectAndTaxSection } from "@/components/account/ProjectAndTaxSection"
import { useProperties } from "@/hooks/useProperties"

export function AccountContent() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    searchParams.get("propertyId")
  )
  const { data: properties = [] } = useProperties()
  const selectedProperty = properties.find(p => p.id === selectedPropertyId)

  // Set initial property only if no property is selected and properties exist
  useEffect(() => {
    if (properties.length > 0 && !selectedPropertyId) {
      const newPropertyId = properties[0].id
      setSelectedPropertyId(newPropertyId)
      setSearchParams({ propertyId: newPropertyId })
    }
  }, [properties, selectedPropertyId, setSearchParams])

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId)
    setSearchParams({ propertyId })
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
        <AccountActions onAddProperty={() => navigate("/property/edit")} />
      </div>

      <PropertySection 
        selectedPropertyId={selectedPropertyId}
        setSelectedPropertyId={handlePropertySelect}
      />

      <ProjectAndTaxSection 
        selectedPropertyId={selectedPropertyId}
        selectedProperty={selectedProperty}
      />
    </>
  )
}