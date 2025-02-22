
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
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Checking existing session:", { exists: !!session, user: session?.user });
        
        if (error) {
          console.error("Error checking session:", error);
          throw error;
        }
        
        if (session) {
          // Wait to ensure session is fully established
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Verify the session is still valid
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            console.log("Session verified with user:", user.id);
            navigate("/account", { replace: true });
          } else {
            console.log("Session exists but user verification failed");
            navigate("/login", { replace: true });
          }
        } else {
          // If no session and not on public routes, redirect to login
          const publicRoutes = ['/', '/login', '/signup'];
          if (!publicRoutes.some(route => window.location.pathname.includes(route))) {
            navigate("/login", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        navigate("/login", { replace: true });
      }
    };

    // Handle OAuth callback
    const handleCallback = async () => {
      // Look for code in URL (authorization code flow)
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        console.log("Found authorization code, processing OAuth callback");
        try {
          // Wait briefly for Supabase to process the code
          await new Promise(resolve => setTimeout(resolve, 100));
          
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
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Verify session is working
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
              throw new Error("Failed to verify user after OAuth");
            }
            
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", { 
        event, 
        sessionExists: !!session, 
        userId: session?.user?.id,
        provider: session?.user?.app_metadata?.provider
      });

      if (event === 'SIGNED_IN') {
        if (session) {
          console.log("Sign in confirmed with session, redirecting to account");
          navigate("/account", { replace: true });
          toast({
            title: "Success!",
            description: "You have successfully signed in.",
          });
        } else {
          console.error("SIGNED_IN event without session");
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to home");
        navigate("/", { replace: true });
      }
    });

    // Initialize auth flow
    const init = async () => {
      // Handle OAuth callback first
      await handleCallback();
      // Then check session if needed
      await checkSession();
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
