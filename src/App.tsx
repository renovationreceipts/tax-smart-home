
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router } from "react-router-dom"

const queryClient = new QueryClient()

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </Router>
  )
}
