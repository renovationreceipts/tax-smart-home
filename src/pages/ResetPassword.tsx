
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

        // Parse the token - but don't sign in automatically
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
          console.error("Token verification error:", error);
          setTokenError("Your password reset link is invalid or has expired. Please request a new one or try the manual code option.");
          return;
        }

        // Store the user email for display purposes
        setUserEmail(data.user.email);
        
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
  }, [location, navigate]);

  const handleRequestNewLink = async () => {
    try {
      navigate("/login", { state: { showResetForm: true } });
      toast({
        title: "Request new link",
        description: "You'll be redirected to request a new password reset link."
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
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
