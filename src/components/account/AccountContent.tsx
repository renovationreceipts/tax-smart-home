import { useState } from "react"
import { AccountActions } from "@/components/account/AccountActions"
import { PropertySection } from "@/components/account/PropertySection"
import { ProjectAndTaxSection } from "@/components/account/ProjectAndTaxSection"
import { useProperties } from "@/hooks/useProperties"
import type { Project } from "@/hooks/useProjects"

export function AccountContent() {
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [propertyToEdit, setPropertyToEdit] = useState<any>(null)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  
  const { data: properties = [] } = useProperties()
  const selectedProperty = properties.find(p => p.id === selectedPropertyId)

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <AccountActions onAddProperty={() => setShowPropertyForm(true)} />
      </div>

      <PropertySection 
        selectedPropertyId={selectedPropertyId}
        setSelectedPropertyId={setSelectedPropertyId}
        showPropertyForm={showPropertyForm}
        setShowPropertyForm={setShowPropertyForm}
        propertyToEdit={propertyToEdit}
        setPropertyToEdit={setPropertyToEdit}
      />

      <ProjectAndTaxSection 
        selectedPropertyId={selectedPropertyId}
        selectedProperty={selectedProperty}
        showProjectForm={showProjectForm}
        setShowProjectForm={setShowProjectForm}
        projectToEdit={projectToEdit}
        setProjectToEdit={setProjectToEdit}
      />
    </>
  )
}