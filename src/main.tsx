import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import Disclaimers from './pages/Disclaimers.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/disclaimers",
    element: <Disclaimers />,
  }
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);