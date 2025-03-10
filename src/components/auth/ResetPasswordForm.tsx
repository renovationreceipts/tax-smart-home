
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePasswordReset } from "@/hooks/auth/usePasswordReset";

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void;
}

export function ResetPasswordForm({ onSwitchToLogin }: ResetPasswordFormProps) {
  const [email, setEmail] = useState("");
  const { 
    isLoading, 
    authError, 
    isResetSuccess, 
    handleResetPassword 
  } = usePasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleResetPassword(email);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
          <label htmlFor="reset-email" className="sr-only">
            Email address
          </label>
          <Input
            id="reset-email"
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
      </div>

      <div className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Sending reset link..." : "Send reset link"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="text-sm text-gray-600 hover:text-gray-900"
          onClick={onSwitchToLogin}
        >
          Back to sign in
        </Button>
      </div>
    </form>
  );
}
