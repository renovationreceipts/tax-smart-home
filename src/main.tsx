import './polyfills'  // This must be the first import
import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Project from "./pages/Project"
import NewProject from "./pages/NewProject"
import EditProject from "./pages/EditProject"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/projects/:id",
        element: <Project />,
      },
      {
        path: "/projects/new",
        element: <NewProject />,
      },
      {
        path: "/projects/:id/edit",
        element: <EditProject />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
