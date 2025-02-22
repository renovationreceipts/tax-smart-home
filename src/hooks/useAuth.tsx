
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

        // Handle OAuth callback if present
        await handleCallback();
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
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
          setInitialized(true);
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Failed to initialize authentication. Please try again.",
          });
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
