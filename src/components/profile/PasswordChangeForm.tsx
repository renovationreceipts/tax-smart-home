
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Check, Loader2 } from "lucide-react"

const passwordFormSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function PasswordChangeForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
  })

  const onSubmit = async (data: PasswordFormValues) => {
    console.log("Password form submitted")
    try {
      setIsLoading(true)
      setIsSuccess(false)
      
      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) {
        console.error("Password update error:", error)
        throw error
      }

      // Show loading state for at least 600ms for better UX
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Show success state
      setIsSuccess(true)
      
      console.log("Password updated successfully")
      
      // Show toast with success icon
      toast({
        title: "Success",
        description: "Password updated successfully",
        icon: <Check className="h-4 w-4 text-green-500" />
      })
      
      // Reset form after a slight delay for better UX
      setTimeout(() => {
        form.reset()
        // Reset success state after 2 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 2000)
      }, 500)
      
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={`space-y-6 transition-all duration-300 ${isSuccess ? 'bg-green-50 rounded-lg p-6 -mx-6' : ''}`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              {...form.register("password")}
              className={`transition-all duration-300 ${isSuccess ? 'border-green-500' : ''}`}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input
              type="password"
              {...form.register("confirmPassword")}
              className={`transition-all duration-300 ${isSuccess ? 'border-green-500' : ''}`}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="relative">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : isSuccess ? (
            <>
              <Check className="h-4 w-4 mr-2 text-white" />
              Updated!
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </Form>
  )
}
