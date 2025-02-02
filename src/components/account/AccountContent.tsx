import { useState } from "react"
import { PropertyForm } from "@/components/PropertyForm"
import { PropertyList } from "@/components/property/PropertyList"
import { EmptyPropertyState } from "@/components/property/EmptyPropertyState"
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable"
import { ProjectsSection } from "@/components/account/ProjectsSection"
import { AccountActions } from "@/components/account/AccountActions"
import { useProperties } from "@/hooks/useProperties"
import { useProjects } from "@/hooks/useProjects"
import { ProjectForm } from "@/components/project/ProjectForm"
import type { Project } from "@/hooks/useProjects"

export function AccountContent() {
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [propertyToEdit, setPropertyToEdit] = useState<any>(null)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  
  const { data: properties = [], refetch: refetchProperties } = useProperties()
  const { data: projects = [], refetch: refetchProjects } = useProjects(selectedPropertyId)

  const handleEditProperty = (property: any) => {
    setPropertyToEdit(property)
    setShowPropertyForm(true)
  }

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project)
    setShowProjectForm(true)
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

  if (showProjectForm && selectedPropertyId) {
    return (
      <ProjectForm
        propertyId={selectedPropertyId}
        project={projectToEdit}
        onCancel={() => {
          setShowProjectForm(false)
          setProjectToEdit(null)
        }}
        onSuccess={() => {
          setShowProjectForm(false)
          setProjectToEdit(null)
          refetchProjects()
        }}
      />
    )
  }

  const selectedProperty = properties.find(p => p.id === selectedPropertyId)

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <AccountActions onAddProperty={() => setShowPropertyForm(true)} />
      </div>

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

      <div className="space-y-6">
        <ProjectsSection 
          propertyId={selectedPropertyId}
          projects={projects}
          onAddProject={() => setShowProjectForm(true)}
          onEditProject={handleEditProject}
        />

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold">Tax Calculation</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            {!selectedProperty 
              ? "Select a property to view detailed tax calculations and potential savings."
              : "Get automated tax calculations based on your property improvements and expenses."
            }
          </p>
          <TaxCalculationTable 
            property={selectedProperty}
            projects={projects}
          />
        </div>
      </div>
    </>
  )
}