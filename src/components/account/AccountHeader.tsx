
import { Button } from "@/components/ui/button"
import { LogOut, User, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface AccountHeaderProps {
  onSignOut: () => void
}

export function AccountHeader({ onSignOut }: AccountHeaderProps) {
  const navigate = useNavigate()
  const [showTaxRatePrompt, setShowTaxRatePrompt] = useState(false)

  useEffect(() => {
    const checkTaxRate = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('tax_rate')
        .eq('id', user.id)
        .single()

      setShowTaxRatePrompt(!profile?.tax_rate)
    }

    checkTaxRate()
  }, [])

  return (
    <div>
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/69bafa75-cbb8-49f9-a552-21142b9fa060.png" 
                alt="RenovationReceipts.com"
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={() => navigate("/community")}
              >
                <Users className="h-4 w-4 mr-2" />
                Community
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={onSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {showTaxRatePrompt && (
        <div className="bg-gray-50 border-b px-4 py-2 text-sm text-gray-600">
          <div className="max-w-7xl mx-auto">
            Add your personalized capital gains tax rate in your{" "}
            <button 
              onClick={() => navigate("/profile")} 
              className="text-primary hover:underline font-medium"
            >
              Profile
            </button>
            .
          </div>
        </div>
      )}
    </div>
  )
}
