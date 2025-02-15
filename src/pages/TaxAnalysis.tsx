
import { useNavigate } from "react-router-dom"
import { ArrowLeft, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable"
import Footer from "@/components/Footer"
import { useProperties } from "@/hooks/useProperties"
import { useProjects } from "@/hooks/useProjects"
import { AccountHeader } from "@/components/account/AccountHeader"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function TaxAnalysis() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: properties = [] } = useProperties()
  const selectedProperty = properties[0] // For now, we'll show the first property
  const { data: projects = [] } = useProjects(selectedProperty?.id)
  const [userTaxRate, setUserTaxRate] = useState(0)

  useEffect(() => {
    const fetchUserTaxRate = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('tax_rate')
        .eq('id', user.id)
        .single()

      if (profile) {
        setUserTaxRate(profile.tax_rate ? profile.tax_rate / 100 : 0)
      }
    }

    fetchUserTaxRate()
  }, [])

  // Calculate total project costs and tax savings
  const totalProjectCosts = projects.reduce((sum, project) => sum + (project?.cost || 0), 0)
  const projectedTaxSavings = totalProjectCosts * userTaxRate

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
      
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 mb-6"
            onClick={() => navigate("/account")}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Button>

          <div className="bg-white rounded-xl">
            <div className="mb-2">
              <h1 className="text-3xl font-bold">Full Savings Analysis</h1>
              <p className="text-gray-500 text-lg">Comprehensive breakdown of your potential savings</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 mt-6 text-center">
              <div className="text-5xl font-bold mb-2">{formatCurrency(projectedTaxSavings)}</div>
              <div className="text-gray-500 text-lg">Lifetime projected savings</div>
            </div>

            <Tabs defaultValue="tax-savings" className="mt-6">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="tax-savings" className="py-3">
                  <div className="text-center">
                    <h3 className="font-semibold">Future Tax Savings</h3>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="tax-credits" className="py-3">
                  <div className="text-center">
                    <h3 className="font-semibold">Tax Credits</h3>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="insurance" className="py-3">
                  <div className="text-center">
                    <h3 className="font-semibold">Insurance Savings</h3>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tax-savings" className="mt-6">
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold">AI Analysis</h2>
                      <p className="text-gray-600 max-w-3xl">
                        These projects appear to meet IRS guidelines considered capital improvements that add value 
                        and extend the useful life of the property, making them eligible for increasing the cost 
                        basis according to IRS guidelines.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <span className="text-2xl font-bold">{formatCurrency(projectedTaxSavings)}</span>
                      </div>
                      <div className="text-sm text-gray-500">Future Tax Savings</div>
                    </div>
                  </div>

                  <div className="mt-8">
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
                </div>
              </TabsContent>

              <TabsContent value="tax-credits" className="mt-6">
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <h2 className="text-xl font-semibold mb-4">Tax Credits</h2>
                  <p className="text-gray-500">Coming soon! We're working on bringing you valuable tax credit opportunities.</p>
                </div>
              </TabsContent>

              <TabsContent value="insurance" className="mt-6">
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <h2 className="text-xl font-semibold mb-4">Insurance Savings</h2>
                  <p className="text-gray-500">Coming soon! We're working on bringing you insurance saving opportunities.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
