
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOAuthCallback } from "./auth/useOAuthCallback";
import { useGoogleAuth } from "./auth/useGoogleAuth";

export function useAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleCallback } = useOAuthCallback();
  const { handleGoogleAuth } = useGoogleAuth();

  useEffect(() => {
    let mounted = true;
    let hasInitialized = false; // Prevent multiple initialization attempts

    const initializeAuth = async () => {
      if (hasInitialized || !mounted) return;
      
      try {
        setLoading(true);
        hasInitialized = true;
        console.log("Initializing auth state...");

        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

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
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      hasInitialized = false;
    };
  }, [navigate, toast]);

  return { 
    handleGoogleAuth
  };
}
