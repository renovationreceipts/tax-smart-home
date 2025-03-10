
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const { toast } = useToast();
  const { handleGoogleAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for hash fragment in URL that indicates a reset password attempt
  useEffect(() => {
    const hash = location.hash;
    // If URL contains #access_token=... or #error=... it's a password reset callback
    if (hash && (hash.includes('access_token=') || hash.includes('error='))) {
      handleResetPasswordCallback(hash);
    }
  }, [location]);

  const handleResetPasswordCallback = async (hash: string) => {
    try {
      if (hash.includes('error=')) {
        // Extract error message from hash
        const errorParam = new URLSearchParams(hash.substring(1)).get('error_description');
        const errorMessage = decodeURIComponent(errorParam || 'Unknown error');
        
        setAuthError(`Password reset failed: ${errorMessage}`);
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: errorMessage,
        });
        return;
      }

      // Process the token
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error processing reset token:", error);
        setAuthError("Invalid or expired reset link. Please request a new one.");
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: "Invalid or expired reset link. Please request a new one.",
        });
      } else if (data?.user) {
        // User is now signed in after using reset link - prompt to set a new password
        toast({
          title: "Set a new password",
          description: "Please enter your new password to complete the reset process.",
        });
        
        // Clear the hash from the URL to prevent confusion if page is refreshed
        window.history.replaceState(null, '', location.pathname);
        
        // Redirect to profile page to set new password
        navigate("/profile");
      }
    } catch (error) {
      console.error("Reset token processing error:", error);
      setAuthError("Failed to process password reset. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process password reset. Please try again.",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("Login error:", error.message); // For debugging
        
        // Check for different types of auth errors
        if (error.message === "400: Invalid login credentials" || 
            error.message.includes("Invalid login credentials")) {
          setAuthError("The email or password you entered is incorrect. Please try again.");
          
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "The email or password you entered is incorrect. Please try again.",
          });
        } else {
          setAuthError(error.message);
          
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message,
          });
        }
      } else if (data.user) {
        // Successful login
        setAuthError(null);
        
        toast({
          title: "Login successful",
          description: "You have successfully signed in.",
        });
        
        // Navigate to account page on successful login
        navigate("/account");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("An unexpected error occurred. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while trying to log in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setIsResetSuccess(false);

    try {
      // Make sure to create a fully qualified URL for the redirect
      const origin = window.location.origin;
      const redirectTo = `${origin}/login`; // Redirect back to login page after reset
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        setIsResetSuccess(true);
        toast({
          title: "Success",
          description: "Password reset instructions have been sent to your email",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setAuthError("An unexpected error occurred. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while trying to reset your password",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

        <form className="mt-8 space-y-6" onSubmit={isResetMode ? handleResetPassword : handleLogin}>
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
              {authError}
            </div>
          )}
          
          {isResetSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-3 text-sm">
              Password reset instructions have been sent to your email. Please check your inbox.
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={authError ? "border-red-300 focus-visible:ring-red-400" : ""}
              />
            </div>
            {!isResetMode && (
              <PasswordInput
                value={password}
                onChange={setPassword}
                className={authError ? "border-red-300 focus-visible:ring-red-400" : ""}
              />
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading 
                ? (isResetMode ? "Sending reset link..." : "Signing in...") 
                : (isResetMode ? "Send reset link" : "Sign in")}
            </Button>

            {!isResetMode && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <GoogleButton 
                  onClick={handleGoogleAuth}
                  text="Sign in with Google"
                />
              </>
            )}

            <Button
              type="button"
              variant="ghost"
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => {
                setIsResetMode(!isResetMode);
                setAuthError(null);
                setIsResetSuccess(false);
              }}
            >
              {isResetMode 
                ? "Back to sign in" 
                : "Forgot your password?"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
