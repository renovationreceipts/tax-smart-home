
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { useSession } from "./auth/useSession";
import { useOAuthCallback } from "./auth/useOAuthCallback";
import { useGoogleAuth } from "./auth/useGoogleAuth";

export function useAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession } = useSession();
  const { handleCallback } = useOAuthCallback();
  const { handleGoogleAuth } = useGoogleAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    const initializeAuth = async () => {
      try {
        console.log("Setting up auth state change listener");
        setIsInitializing(true);

        // Handle OAuth callback first
        await handleCallback();
        // Then check session if needed
        await checkSession();
        
        setIsInitializing(false);
        retryCount = 0; // Reset retry count on success
      } catch (error) {
        console.error("Auth initialization error:", error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying auth initialization (${retryCount}/${maxRetries})...`);
          setTimeout(initializeAuth, retryDelay * retryCount);
        } else {
          setIsInitializing(false);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Failed to initialize authentication. Please try again.",
          });
        }
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", { 
        event, 
        sessionExists: !!session, 
        userId: session?.user?.id,
        provider: session?.user?.app_metadata?.provider
      });

      if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
        if (session) {
          // Verify the session is still valid after a short delay
          await new Promise(resolve => setTimeout(resolve, 500));
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (user) {
            console.log("Sign in/up confirmed with session, redirecting to account");
            navigate("/account", { replace: true });
            toast({
              title: "Success!",
              description: event === 'SIGNED_UP' ? 
                "Your account has been created successfully." :
                "You have successfully signed in.",
            });
          } else {
            console.error(`${event} event without valid user`);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "Session not found after authentication. Please try again.",
            });
            navigate("/login", { replace: true });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to home");
        navigate("/", { replace: true });
      }
    });

    initializeAuth();

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate, toast, handleCallback, checkSession]);

  return { 
    handleGoogleAuth,
    isInitializing
  };
}
