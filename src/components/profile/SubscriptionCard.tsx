
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, AlertTriangle, Check, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface SubscriptionCardProps {
  subscription: any;
  onUpdate: () => void;
}

export function SubscriptionCard({ subscription, onUpdate }: SubscriptionCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const isPremiumActive = subscription?.status === "active";
  const isCancelled = subscription?.cancel_at_period_end;
  const nextBillingDate = subscription?.current_period_end 
    ? new Date(subscription.current_period_end * 1000) 
    : null;

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
      
      const { data, error } = await supabase.functions.invoke('create-portal-session');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to open billing portal. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPremiumActive) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="text-sm text-gray-500">
                Active Premium Member • $20/year
              </p>
            </div>
            <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Active
            </div>
          </div>
          
          {nextBillingDate && (
            <div className="pt-2">
              {isCancelled ? (
                <p className="text-sm text-amber-600">
                  Premium until {format(nextBillingDate, "MMMM d, yyyy")}
                </p>
              ) : (
                <p className="text-sm">
                  Next billing date: {format(nextBillingDate, "MMMM d, yyyy")}
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {isCancelled ? (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleResumeSubscription}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Resume Auto-renewal"
              )}
            </Button>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full text-amber-600 border-amber-200"
                >
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
                    {nextBillingDate ? ` ${format(nextBillingDate, "MMMM d, yyyy")}` : ""}. 
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            Update Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
