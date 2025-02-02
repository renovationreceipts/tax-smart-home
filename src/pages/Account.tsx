import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, User } from "lucide-react"
import { PropertyForm } from "@/components/PropertyForm"
import { PropertyList } from "@/components/property/PropertyList"
import { EmptyPropertyState } from "@/components/property/EmptyPropertyState"
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable"
import { AccountHeader } from "@/components/account/AccountHeader"
import { ProjectsSection } from "@/components/account/ProjectsSection"
import { useProperties } from "@/hooks/useProperties"
import { useProjects } from "@/hooks/useProjects"

export default function Account() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [propertyToEdit, setPropertyToEdit] = useState<any>(null)
  
  const { data: properties = [], refetch: refetchProperties } = useProperties()
  const { data: projects = [] } = useProjects(selectedPropertyId)

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again.",
      })
    }
  }

  const handleEditProperty = (property: any) => {
    setPropertyToEdit(property)
    setShowPropertyForm(true)
  }

  if (showPropertyForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
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
      </div>
    )
  }

  const selectedProperty = properties.find(p => p.id === selectedPropertyId)

  return (
    <div className="min-h-screen bg-gray-50">
      <AccountHeader onSignOut={handleSignOut} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button onClick={() => setShowPropertyForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
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
      </main>
    </div>
  )
}