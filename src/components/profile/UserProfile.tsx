import { useEffect, useState } from "react"
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
  const [isLoading, setIsLoading] = useState(true)

  console.log("UserProfile component rendered")

  const loadUserProfile = async () => {
    console.log("Loading user profile...")
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error("No active session found")
        navigate("/login")
        return
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
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
    } finally {
      setIsLoading(false)
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

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
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