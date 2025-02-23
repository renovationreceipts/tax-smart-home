
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOAuthCallback } from "./auth/useOAuthCallback";
import { useGoogleAuth } from "./auth/useGoogleAuth";
import { useAuth as useAuthContext } from "@/providers/AuthProvider";

export type AuthState = ReturnType<typeof useAuthContext>;

export function useAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleCallback } = useOAuthCallback();
  const { handleGoogleAuth } = useGoogleAuth();
  const authContext = useAuthContext();

  useEffect(() => {
    if (!authContext.isInitialized) return;

    // Redirect unauthenticated users to login
    if (!authContext.isAuthenticated && !authContext.isLoading) {
      navigate('/login');
    }
  }, [authContext.isAuthenticated, authContext.isLoading, authContext.isInitialized, navigate]);

  return {
    ...authContext,
    handleGoogleAuth,
    handleCallback,
  };
}
