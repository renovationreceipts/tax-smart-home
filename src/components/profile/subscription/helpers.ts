
import { isValid, format } from "date-fns";

export function getNextBillingDate(subscription: any): Date | null {
  if (!subscription?.current_period_end) return null;
  
  if (subscription.current_period_end instanceof Date) {
    return isValid(subscription.current_period_end) ? subscription.current_period_end : null;
  }
  
  if (typeof subscription.current_period_end === 'number' || 
      (typeof subscription.current_period_end === 'string' && /^\d+$/.test(subscription.current_period_end))) {
    const date = new Date(Number(subscription.current_period_end) * 1000);
    return isValid(date) ? date : null;
  }
  
  if (typeof subscription.current_period_end === 'string') {
    const date = new Date(subscription.current_period_end);
    return isValid(date) ? date : null;
  }
  
  return null;
}

export function formatDate(date: Date | null): string {
  if (!date || !isValid(date)) return "Unknown date";
  try {
    return format(date, "MMMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return "Invalid date";
  }
}
