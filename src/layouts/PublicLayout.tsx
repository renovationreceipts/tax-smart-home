
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AuthStatus } from "@/types/auth";
import Footer from "@/components/Footer";
import MainNav from "@/components/MainNav";

export function PublicLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { status } = useAuth();
  const from = location.state?.from || "/account";
  
  // Allow users on reset-password page regardless of authentication status,
  // and check if the URL has a recovery token in the hash
  const isResetPasswordPage = location.pathname === '/reset-password';
  const hasRecoveryToken = location.hash.includes('type=recovery');

  if (status === AuthStatus.INITIALIZING) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Only redirect to authenticated routes if:
  // 1. User is logged in, AND
  // 2. Not on reset-password page OR is on reset-password page but doesn't have a recovery token
  if (status === AuthStatus.AUTHENTICATED && 
      (!isResetPasswordPage || (isResetPasswordPage && !hasRecoveryToken))) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}
