
import { AuthProvider } from "@/providers/AuthProvider"
import { Outlet } from "react-router-dom"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

export default App
