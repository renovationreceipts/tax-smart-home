
import { useState } from "react";
import { ArrowUp, Check, CreditCard, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CancelSubscriptionDialog } from "./CancelSubscriptionDialog";

interface SubscriptionActionsProps {
  isPremiumActive: boolean;
  isCancelled: boolean;
  nextBillingDate: Date | null;
  formatDate: (date: Date | null) => string;
  onUpdate: () => void;
}

export function SubscriptionActions({ 
  isPremiumActive, 
  isCancelled, 
  nextBillingDate,
  formatDate,
  onUpdate 
}: SubscriptionActionsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleResumeSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { cancelAtPeriodEnd: false }
      });
      
      if (error) throw error;
      
      onUpdate(); // Refresh subscription data
      
      toast({
        title: "Auto-renewal enabled",
        description: "Your subscription will automatically renew at the end of your billing period",
        icon: <Check className="h-4 w-4 text-green-500" />
      });
    } catch (error) {
      console.error("Error resuming subscription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resume subscription. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdatePayment = () => {
    window.location.href = 'https://billing.stripe.com/p/login/3cs6rx2Ah8AF7SM000';
  };

  const handleUpgradeToPremium = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate checkout. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Premium active user UI
  if (isPremiumActive) {
    return (
      <>
        {isCancelled ? (
          <Button 
            variant="outline" 
            className="w-full flex justify-center items-center gap-2" 
            onClick={handleResumeSubscription}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Resume Auto-renewal
              </>
            )}
          </Button>
        ) : (
          <CancelSubscriptionDialog 
            nextBillingDate={nextBillingDate} 
            formatDate={formatDate} 
            onCancelled={onUpdate} 
          />
        )}
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleUpdatePayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          Update Payment Method
        </Button>
      </>
    );
  }
  
  // Free plan user UI
  return (
    <Button 
      className="w-full flex items-center justify-center gap-2" 
      onClick={handleUpgradeToPremium}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ArrowUp className="h-4 w-4" />
      )}
      Upgrade to Premium
    </Button>
  );
}
