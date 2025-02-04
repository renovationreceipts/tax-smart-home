import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AccountHeader } from "@/components/account/AccountHeader"
import { AccountContent } from "@/components/account/AccountContent"
import Footer from "@/components/Footer"

export default function Account() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Redirect to the main website screen after successful sign out
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
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AccountContent />
      </main>
      <Footer />
    </div>
  )
}