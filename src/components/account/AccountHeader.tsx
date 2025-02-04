import { Button } from "@/components/ui/button"
import { Home, LogOut, User, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface AccountHeaderProps {
  onSignOut: () => void
}

export function AccountHeader({ onSignOut }: AccountHeaderProps) {
  const navigate = useNavigate()

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="text-xl font-bold">CompanyName</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600"
              onClick={() => navigate("/community")}
            >
              <Users className="h-4 w-4 mr-2" />
              Community
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600"
              onClick={() => navigate("/profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}