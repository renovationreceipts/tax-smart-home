
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleResetPassword = async (email: string) => {
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

  return {
    isLoading,
    authError,
    isResetSuccess,
    setAuthError,
    setIsResetSuccess,
    handleResetPassword,
    handleResetPasswordCallback
  };
}
