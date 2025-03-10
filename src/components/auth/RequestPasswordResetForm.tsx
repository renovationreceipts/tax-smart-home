
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePasswordReset } from "@/hooks/auth/usePasswordReset";
import { Loader2, Check, RefreshCw } from "lucide-react";

interface RequestPasswordResetFormProps {
  onSwitchToLogin: () => void;
}

export function RequestPasswordResetForm({ onSwitchToLogin }: RequestPasswordResetFormProps) {
  const [email, setEmail] = useState("");
  const { isLoading, authError, isResetSuccess, handleResetPassword } = usePasswordReset();
  const [networkError, setNetworkError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNetworkError(false);
    
    try {
      await handleResetPassword(email);
    } catch (error) {
      if (error instanceof Error && error.message.includes('network')) {
        setNetworkError(true);
      }
    }
  };

  const handleRetry = () => {
    setNetworkError(false);
    handleSubmit(new Event('submit') as any);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
          {authError}
          {networkError && (
            <div className="mt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="text-red-800 border-red-300 hover:bg-red-100 flex items-center"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Retry
              </Button>
            </div>
          )}
        </div>
      )}

      {isResetSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-3 text-sm">
          Password reset link sent! Please check your email.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authError ? "border-red-300" : ""}
          />
          <p className="mt-1 text-xs text-gray-500">
            We'll send a password reset link to this email
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isResetSuccess}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending Reset Link...
            </>
          ) : isResetSuccess ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Reset Link Sent!
            </>
          ) : (
            "Send Password Reset Link"
          )}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-gray-600 hover:text-gray-900"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Back to login
        </Button>
      </div>
    </form>
  );
}
