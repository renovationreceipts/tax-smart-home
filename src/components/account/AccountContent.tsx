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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
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