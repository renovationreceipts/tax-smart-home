import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AccountActions } from "@/components/account/AccountActions"
import { PropertySection } from "@/components/account/PropertySection"
import { ProjectAndTaxSection } from "@/components/account/ProjectAndTaxSection"
import { useProperties } from "@/hooks/useProperties"

export function AccountContent() {
  const navigate = useNavigate()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const { data: properties = [] } = useProperties()
  const selectedProperty = properties.find(p => p.id === selectedPropertyId)

  return (
    <>
      <div className="flex justify-end mb-6">
        <AccountActions onAddProperty={() => navigate("/property/edit")} />
      </div>

      <PropertySection 
        selectedPropertyId={selectedPropertyId}
        setSelectedPropertyId={setSelectedPropertyId}
      />

      <ProjectAndTaxSection 
        selectedPropertyId={selectedPropertyId}
        selectedProperty={selectedProperty}
      />
    </>
  )
}