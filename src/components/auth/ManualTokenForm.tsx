
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ManualTokenFormProps {
  onSuccess: (email: string) => void;
}

export function ManualTokenForm({ onSuccess }: ManualTokenFormProps) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !token) {
      setError("Please enter both your email and the reset code.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("Verifying OTP for email:", email, "with token length:", token.length);

      // Use the verifyOtp method to manually verify the token
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
      });

      if (error) {
        console.error("Manual token verification error:", error);
        setError(error.message || "Failed to verify the reset code. Please check and try again.");
        toast({
          variant: "destructive",
          title: "Verification Error",
          description: error.message || "Failed to verify the reset code. Please check and try again.",
        });
        return;
      }

      console.log("Manual token verification successful!");
      toast({
        title: "Code Verified",
        description: "Your reset code has been verified. You can now set a new password.",
      });

      // On success, call the callback with the email
      onSuccess(email);

    } catch (err) {
      console.error("Manual token verification error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
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
          />
        </div>
        
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
            Reset Code
          </label>
          <Input
            id="token"
            name="token"
            type="text"
            required
            placeholder="Enter the reset code from your email"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            This is the temporary code provided in your password reset email
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verifying Code...
            </>
          ) : (
            "Verify Reset Code"
          )}
        </Button>
      </div>
    </form>
  );
}
