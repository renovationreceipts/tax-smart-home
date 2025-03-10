
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useLogin } from "@/hooks/auth/useLogin";

interface LoginFormProps {
  onSwitchToReset: () => void;
  handleGoogleAuth: () => void;
}

export function LoginForm({ onSwitchToReset, handleGoogleAuth }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, authError, handleLogin } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
        <PasswordInput
          value={password}
          onChange={setPassword}
          className={authError ? "border-red-300 focus-visible:ring-red-400" : ""}
        />
      </div>

      <div className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

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

        <Button
          type="button"
          variant="ghost"
          className="text-sm text-gray-600 hover:text-gray-900"
          onClick={onSwitchToReset}
        >
          Forgot your password?
        </Button>
      </div>
    </form>
  );
}
