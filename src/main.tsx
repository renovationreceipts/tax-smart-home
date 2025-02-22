
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom"
import App from './App.tsx'
import './index.css'
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
import Disclaimers from './pages/Disclaimers.tsx'
import Terms from './pages/Terms.tsx'
import Privacy from './pages/Privacy.tsx'
import GenerateOGImage from './pages/GenerateOGImage.tsx'

const router = createHashRouter([
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
        element: <Account />
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
        element: <Profile />
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
        element: <EditProperty />
      },
      {
        path: "project/edit/:propertyId/:id?",
        element: <EditProject />
      },
      {
        path: "project/view/:propertyId/:id",
        element: <ViewProject />
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
