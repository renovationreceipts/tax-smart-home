
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
        console.log("Checking existing session:", { exists: !!session, user: session?.user });
        
        if (session) {
          // Only redirect if we're not already on the account page
          if (!window.location.hash.includes('/account')) {
            navigate("/account", { replace: true });
          }
        } else {
          // If no session and not on public routes, redirect to login
          const publicRoutes = ['/', '/login', '/signup'];
          if (!publicRoutes.some(route => window.location.hash.includes(route))) {
            navigate("/login", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/login", { replace: true });
      }
    };

    // Handle OAuth callback parameters
    const handleCallback = async () => {
      // For hash router, we need to check if we're at the root with OAuth params
      const hasOAuthParams = window.location.search.includes('code=') || 
                           window.location.search.includes('access_token=') ||
                           window.location.search.includes('error=');

      console.log("Checking OAuth callback params:", { 
        hasOAuthParams,
        search: window.location.search,
        hash: window.location.hash
      });

      if (hasOAuthParams) {
        console.log("Processing OAuth callback");
        try {
          // Wait for session to be established
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error processing OAuth callback:", error);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "There was an error signing in. Please try again.",
            });
            navigate("/login", { replace: true });
            return;
          }
          
          if (session) {
            console.log("OAuth callback successful, session established:", {
              user: session.user.id,
              email: session.user.email
            });
            navigate("/account", { replace: true });
            toast({
              title: "Success!",
              description: "You have successfully signed in with Google.",
            });
          }
        } catch (error) {
          console.error("Error handling OAuth callback:", error);
          navigate("/login", { replace: true });
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

      if (event === 'SIGNED_IN') {
        console.log("Valid session detected, checking OAuth status");
        // Only handle non-OAuth sign-ins here
        if (!window.location.search.includes('code=')) {
          navigate("/account", { replace: true });
          toast({
            title: "Success!",
            description: "You have successfully signed in.",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        if (window.location.hash !== '#/') {
          navigate("/", { replace: true });
        }
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
      } else if (event === 'USER_UPDATED') {
        console.log("User data updated");
      }
    });

    // First check for OAuth callback, then check session
    handleCallback();
    checkSession();

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
          redirectTo: `${window.location.origin}/#/account`,
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
