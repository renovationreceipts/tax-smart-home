
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export function PublicLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // If authenticated, redirect to account
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}
