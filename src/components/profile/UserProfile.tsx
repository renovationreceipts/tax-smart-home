
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus } from "lucide-react"
import { ProfileSettingsForm } from "./ProfileSettingsForm"
import { PasswordChangeForm } from "./PasswordChangeForm"
import { PropertySection } from "@/components/account/PropertySection"
import { SubscriptionCard } from "./SubscriptionCard"
import { usePremiumStatus } from "@/hooks/usePremiumStatus"

export function UserProfile() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const { isPremium, subscription, isLoading: isPremiumLoading } = usePremiumStatus()
  const [refreshKey, setRefreshKey] = useState(0)

  const refreshSubscription = () => {
    setRefreshKey(prev => prev + 1)
  }

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          navigate("/login", { replace: true })
          return
        }

        const { error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (error) throw error

      } catch (error) {
        console.error("Error in loadUserProfile:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [navigate, toast, refreshKey])

  const handleBackClick = () => {
    navigate("/account", { replace: true })
  }

  if (isLoading || isPremiumLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={handleBackClick}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Properties</CardTitle>
            <Button 
              onClick={() => navigate("/property/edit")}
              size="sm"
              variant="ghost"
              className="sm:!variant-default border border-primary text-primary hover:text-primary"
            >
              <Plus className="h-4 w-4 mr-2 text-primary" />
              <span className="hidden sm:inline">Add Property</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </CardHeader>
          <CardContent>
            <PropertySection 
              selectedPropertyId={selectedPropertyId}
              setSelectedPropertyId={setSelectedPropertyId}
            />
          </CardContent>
        </Card>

        {isPremium && subscription && (
          <SubscriptionCard
            subscription={subscription}
            onUpdate={refreshSubscription}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileSettingsForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordChangeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
