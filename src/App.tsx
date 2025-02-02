import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import SignUp from "@/pages/SignUp"
import Account from "@/pages/Account"
import Profile from "@/pages/Profile"
import NotFound from "@/pages/NotFound"
import { EditProperty } from "@/pages/EditProperty"
import { EditProject } from "@/pages/EditProject"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/property/edit/:id?" element={<EditProperty />} />
        <Route path="/project/edit/:propertyId/:id?" element={<EditProject />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}