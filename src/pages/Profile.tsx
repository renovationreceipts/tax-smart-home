
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/components/profile/UserProfile";

export default function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Profile - Checking auth session:", { exists: !!session });
        
        if (!session) {
          console.log("Profile - No active session found, redirecting to login");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Profile - Error checking session:", error);
        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  return <UserProfile />;
}
