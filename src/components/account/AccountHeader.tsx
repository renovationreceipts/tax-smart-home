
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AccountHeaderProps {
  onSignOut: () => void;
}

export function AccountHeader({
  onSignOut
}: AccountHeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleSignOut = () => {
    setIsMenuOpen(false);
    onSignOut();
  };

  const MobileMenu = () => (
    <div className="fixed inset-x-0 top-[76px] z-50 bg-white border-b shadow-lg">
      <div className="flex flex-col p-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-600"
          onClick={() => handleNavigate("/community")}
        >
          <Users className="h-4 w-4 mr-2" />
          Community
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-600"
          onClick={() => handleNavigate("/profile")}
        >
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-600"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <nav className="bg-white border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[5px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/69bafa75-cbb8-49f9-a552-21142b9fa060.png"
              alt="RenovationReceipts.com"
              className="h-16 w-auto"
              onClick={() => handleNavigate("/account")}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {isMobile ? (
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative z-50"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              {isMenuOpen && <MobileMenu />}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={() => handleNavigate("/community")}
              >
                <Users className="h-4 w-4 mr-2" />
                Community
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={() => handleNavigate("/profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
