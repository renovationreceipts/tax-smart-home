
import { FREE_TIER_LIMITS } from "@/hooks/usePremiumStatus";

interface UsageLimitsProps {
  isPremiumActive: boolean;
  propertyCount: number;
  projectCount: number;
}

export function UsageLimits({ 
  isPremiumActive, 
  propertyCount, 
  projectCount 
}: UsageLimitsProps) {
  return (
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
  );
}
