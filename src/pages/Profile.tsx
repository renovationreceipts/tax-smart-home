
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/components/profile/UserProfile";

export default function Profile() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Profile - Checking auth session:", { exists: !!session });
        
        if (!session) {
          console.log("Profile - No active session found, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }

        if (mounted) {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Profile - Error checking session:", error);
        if (mounted) {
          navigate("/login", { replace: true });
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []); // Only run on mount

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return <UserProfile />;
}
