
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, ScrollRestoration } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import Account from "@/pages/Account"
import EditProperty from "@/pages/EditProperty"
import EditProject from "@/pages/EditProject"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import Profile from "@/pages/Profile"
import SignUp from "@/pages/SignUp"
import Community from "@/pages/Community"
import About from "@/pages/About"
import Disclaimers from './pages/Disclaimers.tsx';
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';
import GenerateOGImage from './pages/GenerateOGImage.tsx';
import Features from './pages/Features.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Index />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/features",
    element: (
      <>
        <Features />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/account",
    element: (
      <>
        <Account />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <SignUp />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <Profile />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/community",
    element: (
      <>
        <Community />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <About />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/property/edit/:id?",
    element: (
      <>
        <EditProperty />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/project/edit/:propertyId/:id?",
    element: (
      <>
        <EditProject />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/disclaimers",
    element: (
      <>
        <Disclaimers />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/terms",
    element: (
      <>
        <Terms />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/privacy-policy",
    element: (
      <>
        <Privacy />
        <ScrollRestoration />
      </>
    ),
  },
  {
    path: "/generate-og-image",
    element: (
      <>
        <GenerateOGImage />
        <ScrollRestoration />
      </>
    ),
  }
]);

const root = createRoot(document.getElementById("root")!)
root.render(
  <App>
    <RouterProvider router={router} />
  </App>
);
