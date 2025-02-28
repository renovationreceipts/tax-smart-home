import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmailField } from "./EmailField";
import { PercentageField } from "./PercentageField";
import { TaxFilingStatusField } from "./TaxFilingStatusField";
import { supabase } from "@/integrations/supabase/client";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { usePropertyLimitCheck } from "@/hooks/useProperties";
import { useProjectLimitCheck } from "@/hooks/useProjects";
const profileFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  taxRate: z.number().min(0).max(100),
  taxFilingStatus: z.string()
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;
export function ProfileSettingsForm() {
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    isPremium
  } = usePremiumStatus();
  const {
    propertiesCount,
    maxProperties
  } = usePropertyLimitCheck();
  const {
    projectsCount,
    maxProjects
  } = useProjectLimitCheck();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: "",
      taxRate: 15,
      taxFilingStatus: "Single"
    }
  });
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) return;
        const {
          data: profile,
          error
        } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (error) throw error;

        // Update form with user data
        form.reset({
          email: profile.email || "",
          taxRate: profile.tax_rate || 15,
          taxFilingStatus: profile.tax_filing_status || "Single"
        });
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile. Please try refreshing the page."
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadUserProfile();
  }, [form, toast]);
  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not found");
      }
      const {
        error
      } = await supabase.from("profiles").update({
        tax_rate: data.taxRate,
        tax_filing_status: data.taxFilingStatus
      }).eq("id", user.id);
      if (error) throw error;
      toast({
        title: "Profile updated",
        description: "Your profile settings have been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }
  return <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Information</h3>
            
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Subscription Status</h4>
                  <p className="text-sm text-gray-500 mt-1">Your current plan and usage limits</p>
                </div>
                {isPremium ? <Badge className="text-white flex items-center gap-1 bg-teal-500">
                    <Star className="h-3 w-3 fill-white" />
                    Premium
                  </Badge> : <Badge variant="outline">Free</Badge>}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Properties</span>
                  <span className={isPremium ? "" : propertiesCount >= maxProperties ? "text-amber-600 font-medium" : ""}>
                    {propertiesCount}/{isPremium ? "∞" : maxProperties}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Projects</span>
                  <span className={isPremium ? "" : projectsCount >= maxProjects ? "text-amber-600 font-medium" : ""}>
                    {projectsCount}/{isPremium ? "∞" : maxProjects}
                  </span>
                </div>
                
                {!isPremium && <div className="mt-4">
                    <Button type="button" className="w-full text-sm mt-2 bg-amber-500 hover:bg-amber-600" onClick={() => {}} // In real implementation this would trigger Stripe
                >
                      Upgrade to Premium - $20/year
                    </Button>
                  </div>}
              </div>
            </div>
          </div>
          
          <EmailField control={form.control} />
          
          <FormField control={form.control} name="taxFilingStatus" render={({
          field
        }) => <TaxFilingStatusField value={field.value} onChange={field.onChange} />} />
          
          <FormField control={form.control} name="taxRate" render={({
          field
        }) => <PercentageField value={field.value} onChange={field.onChange} />} />
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Form>;
}