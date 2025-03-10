
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Loader2 } from "lucide-react";

export function VerifyingToken() {
  return (
    <div className="max-w-md w-full space-y-8 text-center">
      <AuthHeader title="Verifying reset link" />
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      <p className="text-gray-500">Please wait while we verify your password reset link...</p>
    </div>
  );
}
