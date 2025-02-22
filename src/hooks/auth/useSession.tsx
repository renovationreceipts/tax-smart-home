
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

export const useSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkSession = useCallback(async () => {
    try {
      console.log("Starting session check");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking session:", error);
        throw error;
      }
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log("Session valid, user authenticated");
          // Only navigate if we're on login/signup pages
          const authRoutes = ['/login', '/signup'];
          if (authRoutes.some(route => window.location.pathname === route)) {
            navigate("/account", { replace: true });
          }
          return true; // Session is valid
        }
      }
      
      // If we reach here, either no session or invalid session
      console.log("No valid session found");
      const publicRoutes = ['/', '/login', '/signup'];
      if (!publicRoutes.includes(window.location.pathname)) {
        navigate("/login", { replace: true });
      }
      
      return false; // No valid session
    } catch (error) {
      console.error("Error in checkSession:", error);
      if (window.location.pathname !== '/login') {
        navigate("/login", { replace: true });
      }
      return false;
    }
  }, [navigate, toast]);

  return { checkSession };
};
