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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
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