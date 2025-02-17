
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
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Checking existing session:", { exists: !!session });
      if (session) {
        // Check if user has any properties
        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .limit(1);

        console.log("Checking properties:", { hasProperties: properties && properties.length > 0 });

        if (properties && properties.length > 0) {
          console.log("User has properties, redirecting to account");
          navigate("/account", { replace: true });
        } else {
          console.log("No properties found, redirecting to property creation");
          navigate("/property/edit", { replace: true });
        }
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", { event, sessionExists: !!session, userId: session?.user?.id });

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        if (session) {
          console.log("Valid session detected");
          
          try {
            // Check if user has any properties
            const { data: properties, error } = await supabase
              .from('properties')
              .select('id')
              .limit(1);

            if (error) throw error;

            console.log("Checking properties after sign in:", { hasProperties: properties && properties.length > 0 });

            // Determine redirect path based on whether user has properties
            const redirectPath = properties && properties.length > 0 ? '/account' : '/property/edit';
            navigate(redirectPath, { replace: true });
            
            toast({
              title: "Success!",
              description: "You have successfully signed in.",
            });
          } catch (error) {
            console.error("Error checking properties:", error);
            // If we can't check properties, default to account page
            navigate("/account", { replace: true });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        navigate("/", { replace: true });
      }
    });

    // Handle URL hash fragment if present (for OAuth redirects)
    const handleHashFragment = async () => {
      if (window.location.hash) {
        console.log("Found hash fragment, attempting to recover session");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error recovering session:", error);
          return;
        }
        
        if (session) {
          console.log("Successfully recovered session from hash");
          try {
            // Check if user has any properties
            const { data: properties, error: propertiesError } = await supabase
              .from('properties')
              .select('id')
              .limit(1);

            if (propertiesError) throw propertiesError;

            const redirectPath = properties && properties.length > 0 ? '/account' : '/property/edit';
            navigate(redirectPath, { replace: true });
          } catch (error) {
            console.error("Error checking properties:", error);
            navigate("/account", { replace: true });
          }
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
