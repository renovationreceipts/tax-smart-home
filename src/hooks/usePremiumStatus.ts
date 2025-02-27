
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const FREE_TIER_LIMITS = {
  PROPERTY_LIMIT: 1,
  PROJECT_LIMIT: 3
};

export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPremiumStatus() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsPremium(false);
          return;
        }
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching premium status:", error);
          setIsPremium(false);
        } else {
          setIsPremium(!!profile?.is_premium);
        }
      } catch (err) {
        console.error("Error in usePremiumStatus:", err);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPremiumStatus();
  }, []);
  
  return { isPremium, isLoading };
}
