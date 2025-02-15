
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable"
import Footer from "@/components/Footer"
import { useProperties } from "@/hooks/useProperties"
import { useProjects } from "@/hooks/useProjects"
import { AccountHeader } from "@/components/account/AccountHeader"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function TaxAnalysis() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: properties = [] } = useProperties()
  const selectedProperty = properties[0] // For now, we'll show the first property
  const { data: projects = [] } = useProjects(selectedProperty?.id)

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate("/")
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again.",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AccountHeader onSignOut={handleSignOut} />
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/account")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Tax Analysis</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Detailed Tax Calculation</h2>
          {selectedProperty ? (
            <TaxCalculationTable 
              property={selectedProperty}
              projects={projects}
            />
          ) : (
            <p className="text-gray-500">No property selected. Please add a property to view tax calculations.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
