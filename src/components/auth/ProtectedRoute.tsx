
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/hooks/auth/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { session, isLoading, initialized } = useAuthStore();

  // If we haven't initialized auth yet, show nothing
  if (!initialized || isLoading) {
    return null;
  }

  // No session means redirect to login
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // We have a session, render the protected content
  return <>{children}</>;
}
