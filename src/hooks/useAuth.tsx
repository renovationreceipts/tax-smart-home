
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "./auth/useAuthStore";
import { useOAuthCallback } from "./auth/useOAuthCallback";
import { useGoogleAuth } from "./auth/useGoogleAuth";

export function useAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setSession, setUser, setLoading, setInitialized } = useAuthStore();
  const { handleCallback } = useOAuthCallback();
  const { handleGoogleAuth } = useGoogleAuth();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (!mounted) return;
        
        setLoading(true);
        console.log("Initializing auth state...");

        // Get initial session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }

        // Handle OAuth callback after session check
        if (window.location.search.includes('code=')) {
          await handleCallback();
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log("Auth state changed:", { event, hasSession: !!newSession });
          
          if (!mounted) return;

          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (event === 'SIGNED_IN') {
            navigate("/account", { replace: true });
            toast({
              title: "Success!",
              description: "You have successfully signed in.",
            });
          } else if (event === 'SIGNED_OUT') {
            navigate("/", { replace: true });
          }
        });

        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }

        return () => {
          subscription.unsubscribe();
          mounted = false;
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          // Reset state on error
          setSession(null);
          setUser(null);
          setInitialized(true);
          setLoading(false);
          
          // Only show error toast if we're not on a public route
          const publicRoutes = ['/', '/login', '/signup'];
          if (!publicRoutes.includes(window.location.pathname)) {
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "Failed to initialize authentication. Please try logging in again.",
            });
            navigate('/login', { replace: true });
          }
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [navigate, toast, setSession, setUser, setLoading, setInitialized, handleCallback]);

  return { 
    handleGoogleAuth
  };
}
