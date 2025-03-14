
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const MainNav = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { trackEvent } = useAnalytics();
  const scrollToTop = useScrollToTop();

  const handleSignUpClick = () => {
    trackEvent({
      eventName: "signup_click",
      eventType: "click",
      eventData: {
        location: "main_nav"
      }
    });
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    trackEvent({
      eventName: "login_click",
      eventType: "click",
      eventData: {
        location: "main_nav"
      }
    });
    setIsMenuOpen(false);
  };

  const MobileMenu = () => (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
      <Link to="/login" className="block px-4 py-2 text-gray-600 hover:bg-gray-50" onClick={handleLoginClick}>
        Login
      </Link>
      <Link to="/signup" className="block px-4 py-2 text-primary hover:bg-gray-50" onClick={handleSignUpClick}>
        Sign Up for Free
      </Link>
    </div>
  );

  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center relative">
        <div>
          <Link to="/" onClick={scrollToTop}>
            <img 
              src="/lovable-uploads/69bafa75-cbb8-49f9-a552-21142b9fa060.png" 
              alt="RenovationReceipts.com" 
              className="h-14 w-auto" 
            />
          </Link>
        </div>
        {isMobile ? (
          <div>
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative z-50">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            {isMenuOpen && <MobileMenu />}
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-gray-600 hover:text-gray-900" onClick={handleLoginClick}>
              Login
            </Link>
            <Link to="/signup" className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md" onClick={handleSignUpClick}>
              Sign Up for Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNav;
