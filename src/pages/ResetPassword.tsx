
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extract token from URL hash
  useEffect(() => {
    const verifyResetToken = async () => {
      try {
        setIsVerifyingToken(true);
        const hash = location.hash;
        
        // Check if we have a hash with a token
        if (!hash || !(hash.includes('access_token=') || hash.includes('type=recovery'))) {
          setTokenError("Invalid or missing reset token. Please request a new password reset link.");
          return;
        }

        // Parse the token - but don't sign in automatically
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
          console.error("Token verification error:", error);
          setTokenError("Your password reset link is invalid or has expired. Please request a new one.");
          return;
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
  }, [location, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Update user's password
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error("Password update error:", error);
        throw error;
      }

      // Show success state
      setIsSuccess(true);
      
      toast({
        title: "Password updated successfully",
        description: "Your password has been reset. You can now log in with your new password.",
        icon: <Check className="h-4 w-4 text-green-500" />
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error: any) {
      setError(error.message || "Failed to update password. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Error resetting password",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (isVerifyingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <AuthHeader title="Verifying reset link" />
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-gray-500">Please wait while we verify your password reset link...</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <AuthHeader title="Reset link invalid" />
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
            {tokenError}
          </div>
          <Button onClick={handleBackToLogin} className="w-full">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader title="Create New Password" subtitle="Please enter your new password below" />
        
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-3 text-sm">
              Password successfully reset! Redirecting to login...
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error && error.includes("Password") ? "border-red-300" : ""}
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters
              </p>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={error && error.includes("match") ? "border-red-300" : ""}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Password Updated!
                </>
              ) : (
                "Update Password"
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={handleBackToLogin}
              disabled={isLoading || isSuccess}
            >
              Back to login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
