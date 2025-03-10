
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { usePasswordReset } from "@/hooks/auth/usePasswordReset";

export default function Login() {
  const [isResetMode, setIsResetMode] = useState(false);
  const { handleGoogleAuth } = useAuth();
  const location = useLocation();
  const { handleResetPasswordCallback } = usePasswordReset();

  // Check for hash fragment in URL that indicates a reset password attempt
  useEffect(() => {
    const hash = location.hash;
    // If URL contains #access_token=... or #error=... it's a password reset callback
    if (hash && (hash.includes('access_token=') || hash.includes('error='))) {
      handleResetPasswordCallback(hash);
    }
  }, [location, handleResetPasswordCallback]);

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
          <ResetPasswordForm onSwitchToLogin={() => setIsResetMode(false)} />
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
