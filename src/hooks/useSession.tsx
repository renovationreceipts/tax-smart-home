
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

export const useSession = () => {
  const navigate = useNavigate();

  const checkSession = useCallback(async () => {
    try {
      console.log("Starting session check");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log("Session valid, user authenticated");
        return true;
      }
      
      // If we reach here, no valid session
      console.log("No valid session found");
      const publicRoutes = ['/', '/login', '/signup'];
      const currentPath = window.location.pathname;
      
      // Don't redirect if we're already on a public route
      if (!publicRoutes.includes(currentPath)) {
        navigate("/login", { replace: true });
      }
      
      return false;
    } catch (error) {
      console.error("Error in checkSession:", error);
      return false;
    }
  }, [navigate]);

  return { checkSession };
};
