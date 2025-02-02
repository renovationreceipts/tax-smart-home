import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, FileText, Calculator, LogOut, Plus } from "lucide-react"
import { PropertyForm } from "@/components/PropertyForm"
import { PropertyList } from "@/components/property/PropertyList"
import { EmptyPropertyState } from "@/components/property/EmptyPropertyState"
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable"
import { useQuery } from "@tanstack/react-query"

interface Property {
  id: string
  name: string
  address: string
  purchase_price: number
  current_value: number
}

async function fetchProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("id, name, address, purchase_price, current_value")
  
  if (error) throw error
  return data
}

export default function Account() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showPropertyForm, setShowPropertyForm] = useState(false)

  const { data: properties = [], refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  })

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

  if (showPropertyForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <PropertyForm 
          onCancel={() => setShowPropertyForm(false)}
          onSuccess={() => {
            setShowPropertyForm(false)
            refetch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6" />
              <span className="text-xl font-bold">HomeCostTracker</span>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
            <Button onClick={() => setShowPropertyForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>

          {properties.length === 0 ? (
            <EmptyPropertyState onAddProperty={() => setShowPropertyForm(true)} />
          ) : (
            <PropertyList properties={properties} />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Projects</h3>
              </div>
              <Button 
                onClick={() => toast({
                  title: "Not implemented yet",
                  description: "Project creation functionality is coming soon.",
                })}
                disabled={properties.length === 0}
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </div>
            <p className="text-gray-600 text-sm">
              Track home improvement projects for each property. These will be used
              for tax calculations.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Tax Calculation</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Get automated tax calculations based on your property improvements and
              expenses.
            </p>
            <TaxCalculationTable />
          </div>
        </div>
      </main>
    </div>
  )
}