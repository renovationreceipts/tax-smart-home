import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { PercentageField } from "./PercentageField"

const profileFormSchema = z.object({
  email: z.string().email(),
  tax_rate: z.number().min(0).max(100).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function UserProfile() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  })

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

      if (profile) {
        console.log("Resetting form with profile data:", {
          email: user.email,
          tax_rate: profile.tax_rate || 0,
        })
        form.reset({
          email: user.email,
          tax_rate: profile.tax_rate || 0,
        })
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
  }, []) // Empty dependency array means this runs once on mount

  const onSubmit = async (data: ProfileFormValues) => {
    console.log("Form submitted with data:", data)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log("Current auth user:", user)

      if (!user) {
        console.error("No user found during form submission")
        throw new Error("No user found")
      }

      console.log("Updating profile with tax_rate:", data.tax_rate)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          tax_rate: data.tax_rate,
        })
        .eq("id", user.id)

      if (profileError) {
        console.error("Profile update error:", profileError)
        throw profileError
      }

      console.log("Profile updated successfully")
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      
      console.log("Attempting navigation to /account")
      navigate("/account")
    } catch (error) {
      console.error("Error in onSubmit:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      })
    }
  }

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

      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...form.register("email")}
                    disabled
                  />
                </div>

                <PercentageField
                  form={form}
                  name="tax_rate"
                  label="Tax Rate"
                />
              </div>

              <Button type="submit">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}