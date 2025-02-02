import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ProfileSettingsForm } from "./ProfileSettingsForm"
import { PasswordChangeForm } from "./PasswordChangeForm"

export function UserProfile() {
  const navigate = useNavigate()
  const { toast } = useToast()

  console.log("UserProfile component rendered")

  const loadUserProfile = async () => {
    console.log("Loading user profile...")
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log("Auth user data:", user)
      
      if (!user) {
        console.error("No user found in auth")
        throw new Error("No user found")
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      console.log("Profile data:", profile)
      console.log("Profile fetch error:", error)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error in loadUserProfile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile",
      })
    }
  }

  useEffect(() => {
    console.log("UserProfile useEffect triggered")
    loadUserProfile()
  }, [])

  const handleBackClick = () => {
    console.log("Back button clicked, navigating to /account")
    navigate("/account")
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={handleBackClick}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Account
      </Button>

      <div className="space-y-6">
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