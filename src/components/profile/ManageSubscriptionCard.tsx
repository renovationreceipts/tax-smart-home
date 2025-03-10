
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { PlanDetails } from "./subscription/PlanDetails";
import { UsageLimits } from "./subscription/UsageLimits";
import { SubscriptionActions } from "./subscription/SubscriptionActions";
import { getNextBillingDate, formatDate } from "./subscription/helpers";

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
  const isPremiumActive = isPremium && subscription?.status === "active";
  const isCancelled = subscription?.cancel_at_period_end;
  const nextBillingDate = getNextBillingDate(subscription);
  
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
        <div className="space-y-4">
          <PlanDetails 
            isPremiumActive={isPremiumActive}
            isCancelled={isCancelled}
            nextBillingDate={nextBillingDate}
            formatDate={formatDate}
          />
          
          <UsageLimits 
            isPremiumActive={isPremiumActive}
            propertyCount={propertyCount}
            projectCount={projectCount}
          />
        </div>
        
        <div className="space-y-3 pt-2">
          <SubscriptionActions 
            isPremiumActive={isPremiumActive}
            isCancelled={isCancelled}
            nextBillingDate={nextBillingDate}
            formatDate={formatDate}
            onUpdate={onUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
}
