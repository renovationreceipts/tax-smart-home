import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import "./App.css"

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
      <Toaster />
    </QueryClientProvider>
  )
}