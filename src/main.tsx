
import './polyfills'  // This must be the first import
import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
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
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "tax-analysis",
        element: <TaxAnalysis />
      },
      {
        path: "blog",
        element: <Blog />
      },
      {
        path: "blog/track-home-improvement-receipts",
        element: <TrackHomeImprovements />
      },
      {
        path: "blog/homeowners-guide-tax-savings",
        element: <HomeownersGuideTaxSavings />
      },
      {
        path: "blog/capital-gains-101",
        element: <CapitalGains101 />
      },
      {
        path: "account",
        element: <ProtectedRoute><Account /></ProtectedRoute>
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "signup",
        element: <SignUp />
      },
      {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: "community",
        element: <Community />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "property/edit/:id?",
        element: <ProtectedRoute><EditProperty /></ProtectedRoute>
      },
      {
        path: "project/edit/:propertyId/:id?",
        element: <ProtectedRoute><EditProject /></ProtectedRoute>
      },
      {
        path: "project/view/:propertyId/:id",
        element: <ProtectedRoute><ViewProject /></ProtectedRoute>
      },
      {
        path: "disclaimers",
        element: <Disclaimers />
      },
      {
        path: "terms",
        element: <Terms />
      },
      {
        path: "privacy-policy",
        element: <Privacy />
      },
      {
        path: "generate-og-image",
        element: <GenerateOGImage />
      }
    ]
  }
]);

const root = createRoot(document.getElementById("root")!)
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
