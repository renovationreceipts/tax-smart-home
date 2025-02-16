
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { EmailField } from "./EmailField"
import { TaxFilingStatusField, taxFilingStatuses } from "./TaxFilingStatusField"
import { PercentageField } from "./PercentageField"

const profileFormSchema = z.object({
  email: z.string().email(),
  tax_rate: z.number().min(0).max(100).optional(),
  tax_filing_status: z.enum(taxFilingStatuses),
  house_value_growth_rate: z.number().min(0).max(100).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileSettingsForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        console.log("Loading profile data...")
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          console.error("No user found while loading profile")
          return
        }

        // Get profile data from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("Error loading profile:", profileError)
          return
        }

        console.log("Loaded profile data:", profile)
        
        // Set form values with existing data
        form.reset({
          email: user.email,
          tax_rate: profile.tax_rate || 0,
          tax_filing_status: (profile.tax_filing_status as typeof taxFilingStatuses[number]) || "Single",
          house_value_growth_rate: profile.house_value_growth_rate || 4.92,
        })
      } catch (error) {
        console.error("Error in loadProfile:", error)
      }
    }

    loadProfile()
  }, [])

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      console.log("Profile form submitted with data:", data)
      const { data: { user } } = await supabase.auth.getUser()
      console.log("Current auth user:", user)

      if (!user) {
        console.error("No user found during form submission")
        throw new Error("No user found")
      }

      // Only attempt to update email if it's different from current email
      if (data.email !== user.email) {
        console.log("Updating email to:", data.email)
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        })

        if (emailError) {
          console.error("Email update error:", emailError)
          // Handle specific error for email already in use
          if (emailError.message.includes("already been registered")) {
            toast({
              variant: "destructive",
              title: "Email Update Failed",
              description: "This email address is already registered. Please use a different email.",
            })
            return // Exit early to prevent profile update
          }
          throw emailError
        }

        toast({
          title: "Email Update",
          description: "Please check your new email for a confirmation link.",
        })
      }

      // Always update the profile with tax rate, filing status, and house value growth rate
      console.log("Updating profile with data:", data)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          tax_rate: data.tax_rate,
          tax_filing_status: data.tax_filing_status,
          house_value_growth_rate: data.house_value_growth_rate,
        })
        .eq("id", user.id)

      if (profileError) {
        console.error("Profile update error:", profileError)
        throw profileError
      }

      console.log("Profile updated successfully")
      if (data.email === user.email) {
        // Only show success toast if we didn't show email verification toast
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      }
    } catch (error) {
      console.error("Error in onSubmit:", error)
      // Only show generic error if we haven't shown a specific error
      if (!error.message?.includes("already been registered")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update profile",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <EmailField form={form} />
          <TaxFilingStatusField form={form} />
          <PercentageField
            form={form}
            name="tax_rate"
            label="Capital Gains Tax Rate"
          />
          <PercentageField
            form={form}
            name="house_value_growth_rate"
            label="Home Value Annual Appreciation Rate"
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile Changes"
          )}
        </Button>
      </form>
    </Form>
  )
}
