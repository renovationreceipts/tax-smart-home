
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleResetFragment = async () => {
      try {
        setIsVerifying(true);
        
        // Get the hash fragment from the URL
        const hash = location.hash;
        console.log("Hash fragment:", hash);
        
        if (!hash || hash === '#') {
          setError("Invalid reset link. Please request a new password reset link.");
          setIsVerifying(false);
          return;
        }

        // Extract the type and access_token from the hash
        const hashParams = new URLSearchParams(hash.substring(1));
        const type = hashParams.get('type');
        const token = hashParams.get('access_token');
        
        console.log("Hash params:", { type, token: token ? "exists" : "missing" });
        
        if (type !== 'recovery' || !token) {
          setError("Invalid reset link. Please request a new password reset link.");
          setIsVerifying(false);
          return;
        }

        // Store the token for the password form to use
        setAccessToken(token);
        setIsVerifying(false);
      } catch (err) {
        console.error("Error processing reset link:", err);
        setError("An error occurred while processing your reset link. Please try again.");
        setIsVerifying(false);
      }
    };

    handleResetFragment();
  }, [location, toast]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <AuthHeader 
            title="Verifying your link"
            subtitle="Please wait while we verify your password reset link"
          />
          <div className="flex justify-center mt-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

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
          <ResetPasswordForm accessToken={access_token} />
        )}
      </div>
    </div>
  );
}
