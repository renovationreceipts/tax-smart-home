import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Account from "@/pages/Account"
import EditProperty from "@/pages/EditProperty"
import EditProject from "@/pages/EditProject"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import Profile from "@/pages/Profile"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      retry: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/property/edit/:id?" element={<EditProperty />} />
          <Route path="/project/edit/:propertyId/:id?" element={<EditProject />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}