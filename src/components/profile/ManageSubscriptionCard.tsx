
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, AlertTriangle, Check, Loader2, Info, ArrowUp, Calendar, X } from "lucide-react";
import { format, isValid } from "date-fns";
import { FREE_TIER_LIMITS } from "@/hooks/usePremiumStatus";

interface ManageSubscriptionCardProps {
  subscription: any;
  isPremium: boolean;
  onUpdate: () => void;
  propertyCount: number;
  projectCount?: number;
}

export function ManageSubscriptionCard({ 
  subscription, 
  isPremium, 
  onUpdate,
  propertyCount,
  projectCount = 0
}: ManageSubscriptionCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const isPremiumActive = isPremium && subscription?.status === "active";
  const isCancelled = subscription?.cancel_at_period_end;
  
  // Handle the date parsing more carefully
  const nextBillingDate = (() => {
    if (!subscription?.current_period_end) return null;
    
    // Check if it's already a Date object
    if (subscription.current_period_end instanceof Date) {
      return isValid(subscription.current_period_end) ? subscription.current_period_end : null;
    }
    
    // Handle Unix timestamp (number or numeric string)
    if (typeof subscription.current_period_end === 'number' || 
        (typeof subscription.current_period_end === 'string' && /^\d+$/.test(subscription.current_period_end))) {
      const date = new Date(Number(subscription.current_period_end) * 1000);
      return isValid(date) ? date : null;
    }
    
    // Handle ISO string
    if (typeof subscription.current_period_end === 'string') {
      const date = new Date(subscription.current_period_end);
      return isValid(date) ? date : null;
    }
    
    return null;
  })();

  const formatDate = (date: Date | null) => {
    if (!date || !isValid(date)) return "Unknown date";
    try {
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return "Invalid date";
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { cancelAtPeriodEnd: true }
      });
      
      if (error) throw error;
      
      setIsDialogOpen(false);
      onUpdate(); // Refresh subscription data
      
      toast({
        title: "Auto-renewal disabled",
        description: "Your subscription will remain active until the end of your billing period",
        icon: <Check className="h-4 w-4 text-green-500" />
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel subscription. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  const handleUpdatePayment = async () => {
    try {
      setIsLoading(true);
      setErrorDetails(null);
      
      console.log("Invoking create-portal-session function...");
      const { data, error } = await supabase.functions.invoke('create-portal-session');
      
      if (error) {
        console.error("Function invoke error:", error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      if (!data) {
        console.error("No data returned from function");
        throw new Error("No data returned from billing portal");
      }
      
      console.log("Portal session response:", data);
      
      if (data.error) {
        console.error("Portal session error:", data.error, data.details);
        throw new Error(data.details || data.error);
      }
      
      if (!data.url) {
        console.error("No portal URL returned");
        throw new Error("No portal URL returned");
      }
      
      console.log("Redirecting to portal URL:", data.url);
      window.location.href = data.url;
    } catch (error) {
      console.error("Error opening billing portal:", error);
      
      let errorMessage = "Failed to open billing portal. Please try again.";
      if (error instanceof Error) {
        setErrorDetails(error.message);
        errorMessage = "Failed to open billing portal. See details for more information.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
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
  
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Manage Subscription</CardTitle>
          <Badge variant={isPremiumActive ? "default" : "outline"} className={isPremiumActive ? "bg-green-600" : ""}>
            {isPremiumActive ? "Premium" : "Free Plan"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Plan Details */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <h3 className="font-medium text-base">Plan Details</h3>
            <p className="text-sm text-gray-500">
              {isPremiumActive ? "Premium Plan • $20/year" : "Free Plan"}
            </p>
          
            {/* Next Billing Date for Premium */}
            {isPremiumActive && nextBillingDate && (
              <div className="flex items-center text-sm mt-1 gap-1.5">
                <Calendar className="h-4 w-4 text-gray-500" />
                {isCancelled ? (
                  <span className="text-amber-600">
                    Premium until {formatDate(nextBillingDate)}
                  </span>
                ) : (
                  <span>Next billing: {formatDate(nextBillingDate)}</span>
                )}
              </div>
            )}
          </div>
        
          {/* Usage Limits */}
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium mb-2">Usage Limits</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Properties:</span>
                <span className={isPremiumActive ? "font-medium" : (propertyCount >= FREE_TIER_LIMITS.PROPERTY_LIMIT ? "font-medium text-amber-600" : "font-medium")}>
                  {isPremiumActive ? "Unlimited" : `${propertyCount}/${FREE_TIER_LIMITS.PROPERTY_LIMIT}`}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Projects:</span>
                <span className={isPremiumActive ? "font-medium" : (projectCount >= FREE_TIER_LIMITS.PROJECT_LIMIT ? "font-medium text-amber-600" : "font-medium")}>
                  {isPremiumActive ? "Unlimited" : `${projectCount}/${FREE_TIER_LIMITS.PROJECT_LIMIT}`}
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Subscription Actions */}
        <div className="space-y-3 pt-2">
          {isPremiumActive ? (
            <>
              {/* Premium User Actions */}
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full text-amber-600 border-amber-200 flex justify-center items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel Auto-renewal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Cancel Auto-renewal
                      </DialogTitle>
                      <DialogDescription>
                        Your subscription will remain active until the end of your current billing period on 
                        {nextBillingDate ? ` ${formatDate(nextBillingDate)}` : ""}. 
                        After that date, your account will revert to the free plan.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Keep My Subscription
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleCancelSubscription}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Confirm Cancellation"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
              
              {errorDetails && (
                <div className="mt-2 p-3 bg-red-50 text-red-800 text-sm rounded-md flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Error details:</p>
                    <p className="text-xs">{errorDetails}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Free User Actions */
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
