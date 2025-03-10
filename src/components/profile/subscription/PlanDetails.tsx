
import { Calendar } from "lucide-react";
import { format, isValid } from "date-fns";

interface PlanDetailsProps {
  isPremiumActive: boolean;
  isCancelled: boolean;
  nextBillingDate: Date | null;
  formatDate: (date: Date | null) => string;
}

export function PlanDetails({ 
  isPremiumActive, 
  isCancelled, 
  nextBillingDate, 
  formatDate 
}: PlanDetailsProps) {
  return (
    <div className="flex flex-col space-y-1">
      <h3 className="font-medium text-base">Plan Details</h3>
      <p className="text-sm text-gray-500">
        {isPremiumActive ? "Premium Plan • $20/year" : "Free Plan"}
      </p>
    
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
  );
}
