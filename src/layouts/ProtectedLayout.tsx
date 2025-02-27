
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AuthStatus } from "@/types/auth";

export function ProtectedLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { status } = useAuth();

  if (status === AuthStatus.INITIALIZING) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (status === AuthStatus.UNAUTHENTICATED) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // No Footer component in protected routes
  return <>{children}</>;
}
