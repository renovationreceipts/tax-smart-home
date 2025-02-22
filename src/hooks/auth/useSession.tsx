
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
      
      // Only redirect to login if we're not on a public route
      if (!publicRoutes.some(route => currentPath === route)) {
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
