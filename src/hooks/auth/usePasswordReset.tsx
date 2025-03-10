
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

      // Instead of automatically logging in the user, we'll redirect to the reset-password page
      // This allows the user to create a new password
      navigate("/reset-password" + hash);
      
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
      const redirectTo = `${origin}/reset-password`; // Redirect to our new reset-password page
      
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
