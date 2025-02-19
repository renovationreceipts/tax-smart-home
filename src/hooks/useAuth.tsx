
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthChangeEvent } from "@supabase/supabase-js";

export function useAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state change listener");

    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Checking existing session:", { exists: !!session });
        
        if (session) {
          // Only redirect if we're not already on the account page
          if (!window.location.pathname.includes('/account')) {
            navigate("/account", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", { event, sessionExists: !!session, userId: session?.user?.id });

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        if (session) {
          console.log("Valid session detected");
          navigate("/account", { replace: true });
          toast({
            title: "Success!",
            description: "You have successfully signed in.",
          });
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        console.log("User signed out or token refreshed");
        // Only redirect to home if we're not already there
        if (window.location.pathname !== '/') {
          navigate("/", { replace: true });
        }
      }
    });

    // Handle URL hash fragment if present (for OAuth redirects)
    const handleHashFragment = async () => {
      if (window.location.hash) {
        console.log("Found hash fragment, attempting to recover session");
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error recovering session:", error);
            // If there's an error with the session, clear it and redirect to login
            await supabase.auth.signOut();
            navigate("/login", { replace: true });
            return;
          }
          
          if (session) {
            console.log("Successfully recovered session from hash");
            navigate("/account", { replace: true });
          }
        } catch (error) {
          console.error("Error handling hash fragment:", error);
        }
      }
    };
    handleHashFragment();

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleGoogleAuth = async () => {
    try {
      console.log("Initiating Google auth");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error("Google auth error:", error);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Google auth error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while trying to authenticate with Google.",
      });
    }
  };

  return { handleGoogleAuth };
}
