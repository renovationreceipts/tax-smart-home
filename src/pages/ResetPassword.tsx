
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { useToast } from "@/hooks/use-toast";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { TokenErrorState } from "@/components/auth/TokenErrorState";
import { VerifyingToken } from "@/components/auth/VerifyingToken";
import { ManualTokenForm } from "@/components/auth/ManualTokenForm";

export default function ResetPassword() {
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extract token from URL hash
  useEffect(() => {
    const verifyResetToken = async () => {
      try {
        setIsVerifyingToken(true);
        const hash = location.hash;
        
        // Debug the received hash to help troubleshoot
        console.log("Received URL hash:", hash);
        
        // Check if we have a hash with a token or if we're in a recovery flow
        if (!hash || !(hash.includes('access_token=') || hash.includes('type=recovery'))) {
          console.error("No valid token found in URL hash");
          
          // Error messages coming from Supabase
          if (hash.includes('error=')) {
            const errorParam = new URLSearchParams(hash.substring(1)).get('error_description') || 
                              new URLSearchParams(hash.substring(1)).get('error');
            const errorMessage = decodeURIComponent(errorParam || 'Unknown error');
            
            console.error("Error in reset URL:", errorMessage);
            setTokenError(`Your password reset link encountered an error: ${errorMessage}. Please request a new one or try the manual code option.`);
          } else {
            setTokenError("Invalid or missing reset token. Please request a new password reset link or use the manual code option if you received one in your email.");
          }
          return;
        }

        // Important: We do NOT try to exchange the token for a session here
        // Just verify that we have the necessary hash parameters
        
        // In the case of recovery flow, try to get the session to validate the token
        // But DON'T sign in automatically
        if (hash.includes('type=recovery')) {
          // The user will need to verify the token manually in the next step
          // We don't need to do anything here
          console.log("Recovery flow detected, will need manual verification");
        } else if (hash.includes('access_token=')) {
          // For access_token flow, we can verify the token is valid
          // But we don't want to sign in the user
          try {
            // Just parse the token to check it's valid
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            
            if (!accessToken) {
              throw new Error("No access_token found in URL");
            }
            
            // We have a valid token, so we're good to proceed
            console.log("Valid access_token found, proceeding to password reset");
          } catch (err) {
            console.error("Error verifying access token:", err);
            setTokenError("Invalid or expired reset token. Please request a new password reset link.");
            return;
          }
        }
        
        // Token is valid, user can proceed with password reset
        console.log("Token verification successful, user can reset password");
        
      } catch (err) {
        console.error("Token processing error:", err);
        setTokenError("An error occurred while verifying your reset token. Please try again or request a new link.");
      } finally {
        setIsVerifyingToken(false);
      }
    };

    verifyResetToken();
  }, [location]);

  const handleRequestNewLink = () => {
    navigate("/login", { state: { showResetForm: true } });
    toast({
      title: "Request new link",
      description: "You'll be redirected to request a new password reset link."
    });
  };

  const handleSwitchToManual = () => {
    setShowManualEntry(true);
    setTokenError(null);
  };

  if (isVerifyingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <VerifyingToken />
      </div>
    );
  }

  if (tokenError && !showManualEntry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <TokenErrorState 
          tokenError={tokenError} 
          onRequestNewLink={handleRequestNewLink} 
          onUseManualCode={handleSwitchToManual}
        />
      </div>
    );
  }

  if (showManualEntry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <AuthHeader 
            title="Enter Reset Code" 
            subtitle="Please enter the code you received in your password reset email" 
          />
          <ManualTokenForm onSuccess={(email) => setUserEmail(email)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader 
          title="Create New Password" 
          subtitle={userEmail ? `For account: ${userEmail}` : "Please enter your new password below"} 
        />
        <ResetPasswordForm userEmail={userEmail} />
      </div>
    </div>
  );
}
