
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { AuthHeader, AuthBackButton } from "@/components/auth/AuthHeader";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const { handleGoogleAuth } = useAuth();
  const navigate = useNavigate();

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

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Success",
          description: "Password reset instructions have been sent to your email",
        });
        setIsResetMode(false);
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
      <AuthBackButton />
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
              onClick={() => setIsResetMode(!isResetMode)}
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
