import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PercentageField } from "./PercentageField"

const profileFormSchema = z.object({
  email: z.string().email(),
  tax_rate: z.number().min(0).max(100).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileSettingsForm() {
  const { toast } = useToast()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  })

  const onSubmit = async (data: ProfileFormValues) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <PercentageField
            form={form}
            name="tax_rate"
            label="Tax Rate"
          />
        </div>

        <Button type="submit">
          Save Profile Changes
        </Button>
      </form>
    </Form>
  )
}