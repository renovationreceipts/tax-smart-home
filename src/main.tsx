import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import Disclaimers from './pages/Disclaimers.tsx';
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/community",
    element: <Community />,
  },
  {
    path: "/property/edit/:id?",
    element: <EditProperty />,
  },
  {
    path: "/project/edit/:propertyId/:id?",
    element: <EditProject />,
  },
  {
    path: "/disclaimers",
    element: <Disclaimers />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  }
]);

const root = createRoot(document.getElementById("root")!)
root.render(
  <App>
    <RouterProvider router={router} />
  </App>
);