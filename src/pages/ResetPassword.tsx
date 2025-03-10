
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

export default function ResetPassword() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const hash = location.hash;
    
    // If there's no hash, the user probably navigated here directly
    if (!hash) {
      setError("Invalid reset link. Please request a new password reset link.");
      return;
    }

    // Log the hash to help with debugging
    console.log("Processing reset URL hash:", hash);
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader 
          title="Reset Your Password"
          subtitle="Enter your new password below"
        />

        {error ? (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                <span className="font-medium">Error with reset link</span>
              </div>
              <p>{error}</p>
            </div>
            <div className="space-y-4">
              <Button
                onClick={() => navigate("/login", { state: { showResetForm: true } })}
                className="w-full"
              >
                Request New Reset Link
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        ) : (
          <ResetPasswordForm />
        )}
      </div>
    </div>
  );
}
