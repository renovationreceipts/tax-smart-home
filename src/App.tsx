import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { Routes, Route } from "react-router-dom"
import Account from "@/pages/Account"
import EditProperty from "@/pages/EditProperty"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/account" element={<Account />} />
          <Route path="/property/edit/:id" element={<EditProperty />} />
          <Route path="/property/edit" element={<EditProperty />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
