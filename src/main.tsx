
import './polyfills'
import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/providers/AuthProvider"
import { PublicLayout } from "@/layouts/PublicLayout"
import { ProtectedLayout } from "@/layouts/ProtectedLayout"

// Import your components
import Account from "@/pages/Account"
import EditProperty from "@/pages/EditProperty"
import EditProject from "@/pages/EditProject"
import ViewProject from "@/pages/ViewProject"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import Profile from "@/pages/Profile"
import SignUp from "@/pages/SignUp"
import Community from "@/pages/Community"
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

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// Create router with layouts
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      // Public routes
      {
        Component: PublicLayout,
        children: [
          { index: true, Component: Index },
          { path: "login", Component: Login },
          { path: "signup", Component: SignUp },
          { path: "blog", Component: Blog },
          { path: "blog/track-home-improvement-receipts", Component: TrackHomeImprovements },
          { path: "blog/homeowners-guide-tax-savings", Component: HomeownersGuideTaxSavings },
          { path: "blog/capital-gains-101", Component: CapitalGains101 },
          { path: "community", Component: Community },
          { path: "about", Component: About },
          { path: "disclaimers", Component: Disclaimers },
          { path: "terms", Component: Terms },
          { path: "privacy-policy", Component: Privacy },
        ],
      },
      // Protected routes
      {
        Component: ProtectedLayout,
        children: [
          { path: "account", Component: Account },
          { path: "profile", Component: Profile },
          { path: "tax-analysis", Component: TaxAnalysis },
          { path: "property/edit/:id?", Component: EditProperty },
          { path: "project/edit/:propertyId/:id?", Component: EditProject },
          { path: "project/view/:propertyId/:id", Component: ViewProject },
          { path: "generate-og-image", Component: GenerateOGImage },
        ],
      },
    ],
  },
]);

// Create root element
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");
const root = createRoot(container);

// Render app with correct provider nesting
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
