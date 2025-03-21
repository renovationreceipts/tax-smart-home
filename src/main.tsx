
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
import RequestDiscount from "@/pages/RequestDiscount"
import TaxForm from "@/pages/TaxForm"
import TurboTax from "@/pages/TurboTax"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import ResetPassword from "@/pages/ResetPassword"
import Profile from "@/pages/Profile"
import SignUp from "@/pages/SignUp"
import About from "@/pages/About"
import Blog from "@/pages/Blog"
import Contact from "@/pages/Contact"
import TaxAnalysis from "@/pages/TaxAnalysis"
import TrackHomeImprovements from "@/pages/blog/TrackHomeImprovements"
import HomeownersGuideTaxSavings from "@/pages/blog/HomeownersGuideTaxSavings"
import CapitalGains101 from "@/pages/blog/CapitalGains101"
import EliminatePMISooner from "@/pages/blog/EliminatePMISooner"
import Disclaimers from './pages/Disclaimers'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import GenerateOGImage from './pages/GenerateOGImage'

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error && 
           (error.message.includes('not found') || 
            error.message.includes('unauthorized'))) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

// Create the root layout component that includes AuthProvider
function Root() {
  return (
    <AuthProvider>
      <div className="app">
        <Outlet />
      </div>
    </AuthProvider>
  );
}

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
          { path: "reset-password", element: <ResetPassword /> },
          { path: "signup", element: <SignUp /> },
          { path: "blog", element: <Blog /> },
          { path: "blog/track-home-improvement-receipts", element: <TrackHomeImprovements /> },
          { path: "blog/homeowners-guide-tax-savings", element: <HomeownersGuideTaxSavings /> },
          { path: "blog/capital-gains-101", element: <CapitalGains101 /> },
          { path: "blog/eliminate-pmi-sooner", element: <EliminatePMISooner /> },
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
          { path: "request-discount/:projectId", element: <RequestDiscount /> },
          { path: "tax-form/:projectId", element: <TaxForm /> },
          { path: "turbotax/:projectId", element: <TurboTax /> },
          { path: "generate-og-image", element: <GenerateOGImage /> },
          { path: "contact", element: <Contact /> },
        ],
      },
    ],
  },
]);

// Create root element and render app
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");
const root = createRoot(container);

// Create app with providers wrapping router
const App = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

root.render(<App />);
