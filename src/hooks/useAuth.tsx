
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
          // If we have a session but not in OAuth flow, redirect to account
          if (!window.location.search.includes('code=')) {
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
          // Add a delay to ensure auth state is updated
          await new Promise(resolve => setTimeout(resolve, 1000));
          
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
            
            // Clear URL parameters after successful login
            window.history.replaceState({}, document.title, window.location.pathname);
            
            navigate("/account", { replace: true });
            toast({
              title: "Success!",
              description: "You have successfully signed in with Google.",
            });
          } else {
            console.error("No session found after OAuth callback");
            navigate("/login", { replace: true });
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
        provider: session?.user?.app_metadata?.provider,
        currentPath: window.location.hash
      });

      if (event === 'SIGNED_IN') {
        // Skip redirect if we're in OAuth flow
        if (!window.location.search.includes('code=')) {
          console.log("Standard sign-in detected, redirecting to account");
          navigate("/account", { replace: true });
          toast({
            title: "Success!",
            description: "You have successfully signed in.",
          });
        } else {
          console.log("OAuth sign-in detected, letting callback handler manage redirect");
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        if (window.location.hash !== '#/') {
          navigate("/", { replace: true });
        }
      }
    });

    // Handle OAuth callback first, then check session if no OAuth params
    const init = async () => {
      if (window.location.search.includes('code=')) {
        await handleCallback();
      } else {
        await checkSession();
      }
    };

    init();

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
