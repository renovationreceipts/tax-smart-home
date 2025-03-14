
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
import { GrowthRateField } from "./GrowthRateField";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  taxRate: z.number().min(0).max(100),
  taxFilingStatus: z.string(),
  houseValueGrowthRate: z.number().min(0).max(30)
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettingsForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: "",
      taxRate: 15,
      taxFilingStatus: "Single",
      houseValueGrowthRate: 4.92
    }
  });
  
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;

        // Update form with user data
        form.reset({
          email: profile.email || "",
          taxRate: profile.tax_rate || 15,
          taxFilingStatus: profile.tax_filing_status || "Single",
          houseValueGrowthRate: profile.house_value_growth_rate || 4.92
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
      setIsSuccess(false);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not found");
      }
      
      const { error } = await supabase
        .from("profiles")
        .update({
          tax_rate: data.taxRate,
          tax_filing_status: data.taxFilingStatus,
          house_value_growth_rate: data.houseValueGrowthRate
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      // Show loading state for at least 600ms for better UX
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Show success state
      setIsSuccess(true);
      
      // Show toast with success icon
      toast({
        title: "Profile updated",
        description: "Your profile settings have been updated successfully.",
        icon: <Check className="h-4 w-4 text-green-500" />
      });
      
      // Reset success state after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
      
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
  
  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={`space-y-8 transition-all duration-300 ${isSuccess ? 'bg-green-50 rounded-lg p-6 -mx-6' : ''}`}
      >
        <div className="space-y-6">
          <EmailField control={form.control} />
          
          <FormField
            control={form.control}
            name="taxFilingStatus"
            render={({ field }) => (
              <TaxFilingStatusField value={field.value} onChange={field.onChange} />
            )}
          />
          
          <FormField
            control={form.control}
            name="taxRate"
            render={({ field }) => (
              <PercentageField value={field.value} onChange={field.onChange} />
            )}
          />
          
          <FormField
            control={form.control}
            name="houseValueGrowthRate"
            render={({ field }) => (
              <GrowthRateField value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        
        <Button type="submit" disabled={isLoading} className="relative">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : isSuccess ? (
            <>
              <Check className="h-4 w-4 mr-2 text-white" />
              Saved!
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  );
}
