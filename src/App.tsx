
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { useNetworkStatus } from "./hooks/useNetworkStatus";

function App() {
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">You're Offline</h2>
          <p className="text-muted-foreground">
            Please check your internet connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
