
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
          // Only redirect if we're not in OAuth flow
          const isOAuthFlow = window.location.hash.includes('access_token=') || 
                            window.location.search.includes('code=');
          if (!isOAuthFlow) {
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

    // Process hash fragments and extract tokens
    const processHashParams = () => {
      const hash = window.location.hash;
      const hashParts = hash.split('#');
      
      // Check if we have multiple hash fragments
      if (hashParts.length > 2) {
        console.log("Found multiple hash fragments, processing...");
        // Get the access token part (last fragment)
        const tokenPart = hashParts[hashParts.length - 1];
        if (tokenPart.includes('access_token=')) {
          // Clean up URL immediately
          const basePath = hashParts[1] || '';
          window.history.replaceState(
            {},
            document.title,
            `${window.location.pathname}#${basePath}`
          );
          return true;
        }
      }
      return false;
    };

    // Handle OAuth callback
    const handleCallback = async () => {
      const hasHashParams = processHashParams();
      const hasSearchParams = window.location.search.includes('code=');
      
      console.log("Checking OAuth params:", { 
        hasHashParams,
        hasSearchParams,
        hash: window.location.hash,
        search: window.location.search
      });

      if (hasHashParams || hasSearchParams) {
        console.log("Processing OAuth callback");
        try {
          // Wait for Supabase to process the token
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
            
            // Ensure URL is clean
            if (hasSearchParams) {
              window.history.replaceState({}, document.title, window.location.pathname);
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
        provider: session?.user?.app_metadata?.provider,
        currentPath: window.location.hash
      });

      if (event === 'SIGNED_IN') {
        // Skip redirect if we're in OAuth flow
        const isOAuthFlow = window.location.hash.includes('access_token=') || 
                          window.location.search.includes('code=');
        if (!isOAuthFlow) {
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
          redirectTo: `${window.location.origin}`, // Redirect to root instead of /account
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
