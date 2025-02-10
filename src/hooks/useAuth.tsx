
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthChangeEvent } from "@supabase/supabase-js";

export function useAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state change listener"); // Debug log

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", { event, sessionExists: !!session, userId: session?.user?.id }); // More detailed logging

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        if (session) {
          console.log("Valid session detected, redirecting to account"); // Debug log
          toast({
            title: "Success!",
            description: "You have successfully signed in.",
          });
          // Use replace to prevent back navigation and force the route change
          window.location.href = "/account";
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up auth state listener"); // Debug log
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleGoogleAuth = async () => {
    try {
      console.log("Initiating Google auth"); // Debug log
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + "/account",
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error("Google auth error:", error); // Debug log
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
