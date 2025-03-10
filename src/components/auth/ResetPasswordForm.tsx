import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResetPasswordFormProps {
  accessToken: string | null;
}

export function ResetPasswordForm({ accessToken }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

    if (!accessToken) {
      setError("Auth session missing! Please use the reset link from your email again.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Updating password with token...");
      
      // First set the session with the access token
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '',
      });
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }
      
      console.log("Session set successfully, updating password...");
      
      // Then update the user's password
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

  return (
    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-red-600 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-3 text-sm">
          <div className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
            <p>Password successfully reset! Redirecting to login...</p>
          </div>
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
            disabled={isLoading || isSuccess}
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
            disabled={isLoading || isSuccess}
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
          onClick={() => navigate("/login")}
          disabled={isLoading || isSuccess}
        >
          Back to login
        </Button>
      </div>
    </form>
  );
}
