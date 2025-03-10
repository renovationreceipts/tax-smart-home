
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TokenErrorStateProps {
  tokenError: string;
  onRequestNewLink: () => void;
}

export function TokenErrorState({ tokenError, onRequestNewLink }: TokenErrorStateProps) {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          <span className="font-medium">Error with reset link</span>
        </div>
        <p>{tokenError}</p>
        <p className="mt-2 text-sm">
          If you're using Outlook or another email service with link protection, 
          try copying the link directly and pasting it into your browser instead of clicking it.
        </p>
      </div>
      <div className="space-y-4">
        <Button onClick={onRequestNewLink} className="w-full">
          Request New Reset Link
        </Button>
        <Button onClick={() => navigate("/login")} variant="outline" className="w-full">
          Back to Login
        </Button>
      </div>
    </div>
  );
}
