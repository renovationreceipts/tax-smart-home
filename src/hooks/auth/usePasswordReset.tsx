
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
      // Log the hash to help with debugging
      console.log("Processing hash in reset password callback:", hash);
      
      if (hash.includes('error=') || hash.includes('error_description=')) {
        // Extract error message from hash
        const errorParam = new URLSearchParams(hash.substring(1)).get('error_description') || 
                          new URLSearchParams(hash.substring(1)).get('error');
        const errorMessage = decodeURIComponent(errorParam || 'Unknown error');
        
        console.error("Error detected in password reset URL:", errorMessage);
        setAuthError(`Password reset failed: ${errorMessage}`);
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: errorMessage,
        });
        return;
      }

      // Redirect to the reset-password page with the hash intact
      // This allows the reset-password page to process the token
      console.log("Redirecting to reset-password page with hash");
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
      const redirectTo = `${origin}/reset-password`; // Redirect to our reset-password page
      
      console.log(`Sending password reset email to ${email} with redirect to ${redirectTo}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        console.error("Reset password error from Supabase:", error);
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        console.log("Password reset email sent successfully");
        setIsResetSuccess(true);
        toast({
          title: "Success",
          description: "Password reset instructions have been sent to your email. Please check both your inbox and spam/junk folders.",
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
