import { BrowserRouter as Router } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import "./App.css"
import Profile from "@/pages/Profile"

function App() {
  return (
    <Router>
      <Profile />
      <Toaster />
    </Router>
  )
}

export default App
