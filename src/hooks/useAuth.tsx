
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOAuthCallback } from "./auth/useOAuthCallback";
import { useGoogleAuth } from "./auth/useGoogleAuth";
import { useAuth as useAuthContext } from "@/providers/AuthProvider";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/', '/blog', '/about', '/community', '/terms', '/privacy-policy', '/disclaimers'];

export type AuthState = ReturnType<typeof useAuthContext>;

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { handleCallback } = useOAuthCallback();
  const { handleGoogleAuth } = useGoogleAuth();
  const authContext = useAuthContext();

  useEffect(() => {
    if (!authContext.isInitialized) return;

    const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));

    // Only redirect unauthenticated users if they're trying to access a protected route
    if (!authContext.isAuthenticated && !authContext.isLoading && !isPublicRoute) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [
    authContext.isAuthenticated,
    authContext.isLoading,
    authContext.isInitialized,
    location.pathname,
    navigate
  ]);

  return {
    ...authContext,
    handleGoogleAuth,
    handleCallback,
  };
}
