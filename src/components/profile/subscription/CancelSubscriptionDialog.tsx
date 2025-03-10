
import { useState } from "react";
import { AlertTriangle, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CancelSubscriptionDialogProps {
  nextBillingDate: Date | null;
  formatDate: (date: Date | null) => string;
  onCancelled: () => void;
}

export function CancelSubscriptionDialog({ 
  nextBillingDate, 
  formatDate, 
  onCancelled 
}: CancelSubscriptionDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { cancelAtPeriodEnd: true }
      });
      
      if (error) throw error;
      
      setIsDialogOpen(false);
      onCancelled(); // Refresh subscription data
      
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

  return (
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
  );
}
