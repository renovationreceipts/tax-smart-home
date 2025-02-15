
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ArrowRight, ChevronRight, Info, Lock, Plus, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertySection } from "@/components/account/PropertySection"
import { ProjectAndTaxSection } from "@/components/account/ProjectAndTaxSection"
import { AccountHeader } from "@/components/account/AccountHeader"
import Footer from "@/components/Footer"
import { useState, useEffect } from "react"
import { useProperties } from "@/hooks/useProperties"
import { useProjects } from "@/hooks/useProjects"
import { formatCurrency } from "@/lib/utils"

export default function Account() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [userTaxRate, setUserTaxRate] = useState(0)
  const { data: properties = [] } = useProperties()
  const { data: projects = [] } = useProjects(selectedPropertyId)
  const selectedProperty = properties.find(p => p.id === selectedPropertyId)

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
      <main className="flex-grow w-full max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <PropertySection
              selectedPropertyId={selectedPropertyId}
              setSelectedPropertyId={setSelectedPropertyId}
            />
            <ProjectAndTaxSection
              selectedPropertyId={selectedPropertyId}
              selectedProperty={selectedProperty}
            />
          </div>

          {/* Right Rail */}
          <div className="space-y-6">
            {/* Total Savings Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Total Savings</h2>
                <button>
                  <Info className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">{formatCurrency(projectedTaxSavings)}</div>
                  <div className="text-gray-500 mt-1">Lifetime projected savings</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gray-400" />
                    <span>Future Tax Savings</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(projectedTaxSavings)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-gray-400" />
                    <span>Tax Credits</span>
                  </div>
                  <Badge variant="secondary" className="font-medium">Coming Soon</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-gray-400" />
                    <span>Insurance Savings</span>
                  </div>
                  <Badge variant="secondary" className="font-medium">Coming Soon</Badge>
                </div>
              </div>

              <Button 
                variant="link" 
                className="w-full mt-6 text-blue-600 hover:text-blue-700"
                onClick={() => navigate("/tax-analysis")}
              >
                View Full Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Ready to Save Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold mb-2 text-lg">Ready to Save?</h2>
              <p className="text-gray-500 mb-6">Generate documents and unlock monitoring</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Generate IRS-ready tax documents</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Insurance discount request package</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Continuous monitoring for new savings</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Unlimited project storage</span>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold inline-flex items-baseline">
                  $10
                  <span className="text-lg text-gray-500 font-normal">/year</span>
                </div>
              </div>

              <Button className="w-full bg-black hover:bg-gray-800 text-white">
                Generate Documents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
