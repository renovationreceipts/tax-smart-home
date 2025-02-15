
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable"
import Footer from "@/components/Footer"
import { useProperties } from "@/hooks/useProperties"
import { useProjects } from "@/hooks/useProjects"

export default function TaxAnalysis() {
  const navigate = useNavigate()
  const { data: properties = [] } = useProperties()
  const selectedProperty = properties[0] // For now, we'll show the first property
  const { data: projects = [] } = useProjects(selectedProperty?.id)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
