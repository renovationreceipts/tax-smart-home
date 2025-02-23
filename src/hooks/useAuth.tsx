
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOAuthCallback } from "./auth/useOAuthCallback";
import { useGoogleAuth } from "./auth/useGoogleAuth";
import { useAuth as useAuthContext } from "@/providers/AuthProvider";

export function useAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleCallback } = useOAuthCallback();
  const { handleGoogleAuth } = useGoogleAuth();
  const authContext = useAuthContext();

  return { 
    ...authContext,
    handleGoogleAuth,
    handleCallback
  };
}
