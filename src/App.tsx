
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router } from "react-router-dom"

const queryClient = new QueryClient()

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
