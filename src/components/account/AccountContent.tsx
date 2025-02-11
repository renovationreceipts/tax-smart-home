
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AccountActions } from "@/components/account/AccountActions"
import { PropertySection } from "@/components/account/PropertySection"
import { ProjectAndTaxSection } from "@/components/account/ProjectAndTaxSection"
import { useProperties } from "@/hooks/useProperties"
import { House } from "lucide-react"

export function AccountContent() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    searchParams.get("propertyId")
  )
  const { data: properties = [] } = useProperties()
  const selectedProperty = properties.find(p => p.id === selectedPropertyId)

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
