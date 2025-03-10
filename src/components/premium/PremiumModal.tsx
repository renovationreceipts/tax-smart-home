
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FREE_TIER_LIMITS } from "@/hooks/usePremiumStatus";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  propertyCount?: number;
  projectCount?: number;
}

export function PremiumModal({
  open,
  onClose,
  propertyCount = 0,
  projectCount = 0
}: PremiumModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    toast
  } = useToast();

  const handleUpgradeClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Starting checkout process...");

      // Get the current URL for success and cancel URLs
      const origin = window.location.origin;
      const success_url = `${origin}/account?checkout_success=true`;
      const cancel_url = `${origin}/account?checkout_cancelled=true`;
      console.log("Calling create-checkout function...");
      // Call our Edge Function to create a checkout session
      const {
        data,
        error
      } = await supabase.functions.invoke("create-checkout", {
        body: {
          success_url,
          cancel_url
        }
      });
      console.log("Edge function response:", {
        data,
        error
      });
      if (error) {
        console.error("Error creating checkout session:", error);
        setError("Server error: " + error.message);
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Failed to create checkout session. Please try again."
        });
        return;
      }

      // If we have a URL, redirect to Stripe checkout
      if (data?.url) {
        console.log("Redirecting to Stripe checkout...");
        window.location.href = data.url;
      } else if (data?.error) {
        // Show any errors from the edge function
        console.error("Error from edge function:", data.error);
        setError("Checkout error: " + data.error);
        toast({
          variant: "destructive",
          title: "Checkout Error",
          description: data.error
        });
      } else {
        // Fallback error
        console.error("No URL returned from checkout function");
        setError("No checkout URL returned from server");
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Unable to process checkout. Please try again."
        });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Unexpected error: " + (err instanceof Error ? err.message : String(err)));
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2">
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Unlock unlimited properties and projects for just $20/year
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="border rounded-lg p-4 bg-amber-50 border-amber-200">
            <div className="space-y-1">
              <p className="text-sm font-medium">Your current usage:</p>
              <p className="text-sm">Properties: {propertyCount}/{FREE_TIER_LIMITS.PROPERTY_LIMIT}</p>
              <p className="text-sm">Projects: {projectCount}/{FREE_TIER_LIMITS.PROJECT_LIMIT}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Premium Benefits:</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0" />
                <span>Unlimited properties</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0" />
                <span>Unlimited projects</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0" />
                <span>Priority customer support</span>
              </li>
            </ul>
          </div>
          
          {error && <div className="text-red-500 bg-red-50 p-3 rounded-md border border-red-200 text-sm">
              {error}
            </div>}
          
          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={handleUpgradeClick} disabled={isLoading} className="w-full font-medium bg-emerald-500 hover:bg-emerald-400">
              {isLoading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </> : "Upgrade Now - $20/year"}
            </Button>
            <Button variant="outline" className="w-full" onClick={onClose} disabled={isLoading}>
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}
