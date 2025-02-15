
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ChevronRight, Info, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Footer from "@/components/Footer"
import { PropertySection } from "@/components/account/PropertySection"
import { useState } from "react"

export default function Account() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  
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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <main className="flex-grow w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Projects Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Home Project Vault</h1>
                <p className="text-gray-500 mt-1">Secure storage for all your home improvements</p>
              </div>
              <Button 
                onClick={() => navigate('/project/new')}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>

            <PropertySection
              selectedPropertyId={selectedPropertyId}
              setSelectedPropertyId={setSelectedPropertyId}
            />
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-2">Recent Projects</h2>
              <p className="text-gray-500 mb-6">Track improvements, repairs, and upgrades</p>
              
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">Kitchen Remodel</h3>
                    <p className="text-gray-500">Added Feb 2024 • $45,000</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      Energy Efficient
                    </span>
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                      Value Add
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Why Save Your Records?</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Proof for future home sale tax savings</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Documentation for insurance claims</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Records for tax credits and deductions</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <p className="font-semibold">You're making a smart choice! All your records are encrypted and securely stored.</p>
                <p className="text-gray-500">Your data is protected with bank-level security, ensuring your valuable home improvement history is safe and accessible when you need it.</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  Learn More About Our Security
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Savings Summary */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Total Savings</h2>
                <button>
                  <Info className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">$178,950</div>
                  <div className="text-gray-500 mt-1">Lifetime projected savings</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-gray-400" />
                    <span>Future Tax Savings</span>
                  </div>
                  <span className="font-semibold">$176,000</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-gray-400" />
                    <span>Tax Credits</span>
                  </div>
                  <span className="font-semibold">$2,500</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-gray-400" />
                    <span>Insurance Savings</span>
                  </div>
                  <span className="font-semibold">$450/yr</span>
                </div>
              </div>

              <Button 
                variant="link" 
                className="w-full mt-6 text-blue-600 hover:text-blue-700"
              >
                View Full Analysis
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
