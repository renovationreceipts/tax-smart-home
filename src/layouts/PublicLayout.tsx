
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

  if (status === AuthStatus.INITIALIZING) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (status === AuthStatus.AUTHENTICATED) {
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
