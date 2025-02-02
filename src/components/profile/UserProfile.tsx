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
import { Separator } from "@/components/ui/separator"

const profileFormSchema = z.object({
  email: z.string().email(),
  tax_rate: z.number().min(0).max(100).optional(),
})

const passwordFormSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function UserProfile() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
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
        profileForm.reset({
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

  const onSubmitProfile = async (data: ProfileFormValues) => {
    console.log("Profile form submitted with data:", data)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log("Current auth user:", user)

      if (!user) {
        console.error("No user found during form submission")
        throw new Error("No user found")
      }

      // Update email in auth if it has changed
      if (data.email !== user.email) {
        console.log("Updating email to:", data.email)
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        })

        if (emailError) {
          console.error("Email update error:", emailError)
          throw emailError
        }

        toast({
          title: "Email Update",
          description: "Please check your new email for a confirmation link.",
        })
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
    } catch (error) {
      console.error("Error in onSubmit:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      })
    }
  }

  const onSubmitPassword = async (data: PasswordFormValues) => {
    console.log("Password form submitted")
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) {
        console.error("Password update error:", error)
        throw error
      }

      console.log("Password updated successfully")
      passwordForm.reset()
      toast({
        title: "Success",
        description: "Password updated successfully",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password",
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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...profileForm.register("email")}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <PercentageField
                    form={profileForm}
                    name="tax_rate"
                    label="Tax Rate"
                  />
                </div>

                <Button type="submit">
                  Save Profile Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      {...passwordForm.register("password")}
                    />
                    {passwordForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      type="password"
                      {...passwordForm.register("confirmPassword")}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button type="submit">
                  Update Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}