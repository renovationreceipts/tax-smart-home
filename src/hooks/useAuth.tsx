
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthResponse } from "@supabase/supabase-js";
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
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Setting up auth state change listener");
        setIsInitializing(true);

        // Handle OAuth callback first
        await handleCallback();
        // Then check session if needed
        await checkSession();
        
        if (mounted) {
          setIsInitializing(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", { 
        event, 
        sessionExists: !!session, 
        userId: session?.user?.id,
        provider: session?.user?.app_metadata?.provider
      });

      if (session?.user) {
        if (event === 'SIGNED_IN') {
          console.log("Sign in confirmed with session, redirecting to account");
          navigate("/account", { replace: true });
          toast({
            title: "Success!",
            description: "You have successfully signed in.",
          });
        } else if (event === 'USER_UPDATED') {
          console.log("User created successfully, redirecting to account");
          navigate("/account", { replace: true });
          toast({
            title: "Success!",
            description: "Your account has been created successfully.",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to home");
        navigate("/", { replace: true });
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate, toast, handleCallback, checkSession]);

  return { 
    handleGoogleAuth,
    isInitializing
  };
}
