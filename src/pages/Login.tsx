
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { RequestPasswordResetForm } from "@/components/auth/RequestPasswordResetForm";
import { usePasswordReset } from "@/hooks/auth/usePasswordReset";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [isResetMode, setIsResetMode] = useState(false);
  const { handleGoogleAuth } = useAuth();
  const location = useLocation();
  const { handleResetPasswordCallback } = usePasswordReset();
  const { toast } = useToast();

  useEffect(() => {
    // Check if reset mode should be activated based on URL params or state
    const searchParams = new URLSearchParams(location.search);
    const showResetForm = searchParams.get('reset') === 'true' || 
                          (location.state && location.state.showResetForm);
    
    if (showResetForm) {
      setIsResetMode(true);
    }
  }, [location]);

  // Check for hash fragment in URL that indicates a reset password attempt
  useEffect(() => {
    const hash = location.hash;
    
    // Add logging to help debug the issue
    if (hash) {
      console.log("Login - Detected URL hash:", hash);
    }
    
    // If URL contains #access_token=... or #error=... it's a password reset callback
    if (hash && (hash.includes('access_token=') || hash.includes('error='))) {
      console.log("Login - Processing password reset callback");
      
      try {
        handleResetPasswordCallback(hash);
      } catch (error) {
        console.error("Login - Error handling password reset callback:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem processing your password reset request. Please try again.",
        });
      }
    }
  }, [location, handleResetPasswordCallback, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader 
          title={isResetMode ? "Reset Password" : "Sign in to your account"}
          subtitle={!isResetMode && (
            <>
              Or{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary/90"
              >
                create a new account
              </Link>
            </>
          )}
        />

        {isResetMode ? (
          <RequestPasswordResetForm onSwitchToLogin={() => setIsResetMode(false)} />
        ) : (
          <LoginForm 
            onSwitchToReset={() => setIsResetMode(true)} 
            handleGoogleAuth={handleGoogleAuth}
          />
        )}
      </div>
    </div>
  );
}
