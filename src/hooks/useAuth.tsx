
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthResponse } from "@supabase/supabase-js";
import { useSession } from "./auth/useSession";
import { useOAuthCallback } from "./auth/useOAuthCallback";
import { useGoogleAuth } from "./auth/useGoogleAuth";

export function useAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession } = useSession();
  const { handleCallback } = useOAuthCallback();
  const { handleGoogleAuth } = useGoogleAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Setting up auth state change listener");
        if (!mounted) return;
        
        // Handle OAuth callback first
        await handleCallback();
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log("Auth state changed:", { event, hasSession: !!newSession });
          
          if (!mounted) return;

          if (newSession?.user) {
            // Don't navigate if we're already on a protected route
            const protectedRoutes = ['/account', '/profile', '/tax-analysis'];
            const currentPath = window.location.pathname;
            const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
            
            if (event === 'SIGNED_IN' && !isProtectedRoute) {
              navigate("/account", { replace: true });
              toast({
                title: "Success!",
                description: "You have successfully signed in.",
              });
            }
          } else if (event === 'SIGNED_OUT') {
            navigate("/", { replace: true });
          }
        });

        if (mounted) {
          setIsInitializing(false);
        }

        return () => {
          subscription.unsubscribe();
          mounted = false;
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setIsInitializing(false);
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
  }, [navigate, toast, handleCallback]);

  return { 
    handleGoogleAuth,
    isInitializing
  };
}
