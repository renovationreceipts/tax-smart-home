
import { useState } from "react";
import { Link } from "react-router-dom";
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
  const { toast } = useToast();
  const { handleGoogleAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "The email or password you entered is incorrect. Please try again.";
        }
        
        toast({
          variant: "destructive",
          title: "Login failed",
          description: errorMessage,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
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

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
              />
            </div>
            {!isResetMode && (
              <PasswordInput
                value={password}
                onChange={setPassword}
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
                    <span className="bg-gray-50 px-2 text-muted-foreground">
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
