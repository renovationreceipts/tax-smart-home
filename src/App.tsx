import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Account from "@/pages/Account"
import EditProperty from "@/pages/EditProperty"
import EditProject from "@/pages/EditProject"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Account />} />
          <Route path="/account" element={<Account />} />
          <Route path="/property/edit/:id?" element={<EditProperty />} />
          <Route path="/project/edit/:propertyId/:id?" element={<EditProject />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}