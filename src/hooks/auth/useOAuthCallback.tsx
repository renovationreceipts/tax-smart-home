
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useOAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCallback = async () => {
    // Look for code in URL (authorization code flow)
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      console.log("Found authorization code, processing OAuth callback");
      try {
        // Wait briefly for Supabase to process the code
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error processing OAuth callback:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was an error signing in. Please try again.",
          });
          navigate("/login", { replace: true });
          return;
        }
        
        if (session) {
          console.log("OAuth callback successful, session established:", {
            user: session.user.id,
            email: session.user.email
          });
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Verify session is working
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            throw new Error("Failed to verify user after OAuth");
          }
          
          navigate("/account", { replace: true });
          toast({
            title: "Success!",
            description: "You have successfully signed in with Google.",
          });
        } else {
          console.error("No session found after OAuth callback");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error handling OAuth callback:", error);
        navigate("/login", { replace: true });
      }
    }
  };

  return { handleCallback };
};
