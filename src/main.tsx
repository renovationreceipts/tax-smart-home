
import './polyfills'
import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/providers/AuthProvider"
import { PublicLayout } from "@/layouts/PublicLayout"
import { ProtectedLayout } from "@/layouts/ProtectedLayout"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"

// Import your components
import Account from "@/pages/Account"
import EditProperty from "@/pages/EditProperty"
import EditProject from "@/pages/EditProject"
import ViewProject from "@/pages/ViewProject"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import Profile from "@/pages/Profile"
import SignUp from "@/pages/SignUp"
import About from "@/pages/About"
import Blog from "@/pages/Blog"
import TaxAnalysis from "@/pages/TaxAnalysis"
import TrackHomeImprovements from "@/pages/blog/TrackHomeImprovements"
import HomeownersGuideTaxSavings from "@/pages/blog/HomeownersGuideTaxSavings"
import CapitalGains101 from "@/pages/blog/CapitalGains101"
import Disclaimers from './pages/Disclaimers'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import GenerateOGImage from './pages/GenerateOGImage'

// Configure React Query with more robust error handling and retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 404s or auth errors
        if (error instanceof Error && 
           (error.message.includes('not found') || 
            error.message.includes('unauthorized'))) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes - renamed from cacheTime
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

// Create router with layouts
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // Public routes
      {
        element: <PublicLayout><Outlet /></PublicLayout>,
        children: [
          { index: true, element: <Index /> },
          { path: "login", element: <Login /> },
          { path: "signup", element: <SignUp /> },
          { path: "blog", element: <Blog /> },
          { path: "blog/track-home-improvement-receipts", element: <TrackHomeImprovements /> },
          { path: "blog/homeowners-guide-tax-savings", element: <HomeownersGuideTaxSavings /> },
          { path: "blog/capital-gains-101", element: <CapitalGains101 /> },
          { path: "about", element: <About /> },
          { path: "disclaimers", element: <Disclaimers /> },
          { path: "terms", element: <Terms /> },
          { path: "privacy-policy", element: <Privacy /> },
        ],
      },
      // Protected routes
      {
        element: <ProtectedLayout><Outlet /></ProtectedLayout>,
        children: [
          { path: "account", element: <Account /> },
          { path: "profile", element: <Profile /> },
          { path: "tax-analysis", element: <TaxAnalysis /> },
          { path: "property/edit/:id?", element: <EditProperty /> },
          { path: "project/edit/:propertyId/:id?", element: <EditProject /> },
          { path: "project/view/:propertyId/:id", element: <ViewProject /> },
          { path: "generate-og-image", element: <GenerateOGImage /> },
        ],
      },
    ],
  },
]);

// Create the root component that provides auth context
function Root() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="app">
            <Outlet />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// Create root element and render app
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
