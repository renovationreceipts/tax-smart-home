
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Only check premium status if authenticated
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      setIsPremium(false);
      return;
    }

    async function checkPremiumStatus() {
      setIsLoading(true);
      try {
        // First check the profile directly for the premium flag
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching premium status:', profileError);
          setIsPremium(false);
          return;
        }

        if (profile?.is_premium) {
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }

        // Now call the edge function to verify subscription status
        // This ensures our premium status is always up-to-date
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
          return;
        }

        if (data) {
          setIsPremium(data.isPremium);
          setSubscription(data.subscription);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkPremiumStatus();

    // Re-check when page becomes visible (in case they just completed checkout)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkPremiumStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, isAuthenticated]);

  // Check for checkout results in the URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const checkoutSuccess = urlParams.get('checkout_success');
      const checkoutCancelled = urlParams.get('checkout_cancelled');

      if (checkoutSuccess === 'true') {
        toast({
          title: 'Premium upgrade successful!',
          description: 'Welcome to Premium! You now have access to all premium features.',
        });
        
        // Remove query params from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('checkout_success');
        window.history.replaceState({}, '', url);
      } 
      
      if (checkoutCancelled === 'true') {
        toast({
          title: 'Checkout cancelled',
          description: 'You can upgrade to Premium anytime from your account.',
          variant: 'default',
        });
        
        // Remove query params from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('checkout_cancelled');
        window.history.replaceState({}, '', url);
      }
    }
  }, [toast]);

  return { isPremium, isLoading, subscription };
}
