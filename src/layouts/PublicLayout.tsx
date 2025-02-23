
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function PublicLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const from = location.state?.from || "/account";

  // Don't show anything until auth is initialized
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authenticated, redirect to the intended page or account
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
