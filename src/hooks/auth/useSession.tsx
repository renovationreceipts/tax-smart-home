
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Checking existing session:", { exists: !!session, user: session?.user });
      
      if (error) {
        console.error("Error checking session:", error);
        throw error;
      }
      
      if (session) {
        // Wait to ensure session is fully established
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verify the session is still valid
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log("Session verified with user:", user.id);
          // Only navigate if we're on login/signup pages
          const authRoutes = ['/login', '/signup'];
          if (authRoutes.some(route => window.location.pathname === route)) {
            navigate("/account", { replace: true });
          }
          return; // Exit early if session is valid
        } else {
          console.log("Session exists but user verification failed");
          // Only navigate if not on public routes and not on property edit
          const publicRoutes = ['/', '/login', '/signup'];
          const propertyRoutes = ['/property/edit', '/property/edit/'];
          const isPublicRoute = publicRoutes.some(route => window.location.pathname === route);
          const isPropertyRoute = propertyRoutes.some(route => window.location.pathname.startsWith(route));
          
          if (!isPublicRoute && !isPropertyRoute) {
            navigate("/login", { replace: true });
          }
        }
      } else {
        // If no session and not on public routes, redirect to login
        const publicRoutes = ['/', '/login', '/signup'];
        const propertyRoutes = ['/property/edit', '/property/edit/'];
        const isPublicRoute = publicRoutes.some(route => window.location.pathname === route);
        const isPropertyRoute = propertyRoutes.some(route => window.location.pathname.startsWith(route));
        
        if (!isPublicRoute && !isPropertyRoute) {
          navigate("/login", { replace: true });
        }
      }
    } catch (error) {
      console.error("Error in checkSession:", error);
      // Only navigate on error if not already on login and not on property edit
      const propertyRoutes = ['/property/edit', '/property/edit/'];
      const isPropertyRoute = propertyRoutes.some(route => window.location.pathname.startsWith(route));
      
      if (window.location.pathname !== '/login' && !isPropertyRoute) {
        navigate("/login", { replace: true });
      }
    }
  };

  return { checkSession };
};
