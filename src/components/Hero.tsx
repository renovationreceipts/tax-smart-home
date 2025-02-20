import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
export const Hero = () => {
  const {
    trackEvent
  } = useAnalytics();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleSignUpClick = () => {
    trackEvent({
      eventName: "signup_click",
      eventType: "click",
      eventData: {
        location: "hero_section"
      }
    });
    setIsMenuOpen(false);
  };
  const handleLoginClick = () => {
    trackEvent({
      eventName: "login_click",
      eventType: "click",
      eventData: {
        location: "hero_section"
      }
    });
    setIsMenuOpen(false);
  };
  const MobileMenu = () => <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
      <Link to="/login" className="block px-4 py-2 text-gray-600 hover:bg-gray-50" onClick={handleLoginClick}>
        Login
      </Link>
      <Link to="/signup" className="block px-4 py-2 text-primary hover:bg-gray-50" onClick={handleSignUpClick}>
        Sign Up for Free
      </Link>
    </div>;
  return <div className="w-full hero-gradient">
      <nav className="w-full max-w-7xl mx-auto py-4 px-4 flex justify-between items-center relative">
        <div>
          <img src="/lovable-uploads/69bafa75-cbb8-49f9-a552-21142b9fa060.png" alt="RenovationReceipts.com" className="h-16 sm:h-20 w-auto" />
        </div>
        {isMobile ? <div>
            <Button variant="ghost" size="lg" onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative z-50">
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </Button>
            {isMenuOpen && <MobileMenu />}
          </div> : <div className="flex gap-4 items-center">
            <Link to="/login" className="text-black hover:text-gray-900" onClick={handleLoginClick}>
              Login
            </Link>
            <Link to="/signup" className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md" onClick={handleSignUpClick}>
              Sign Up for Free
            </Link>
          </div>}
      </nav>
      <div className="w-full py-16 sm:py-20 px-4 lg:py-[50px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="space-y-8">
              <h1 className="sm:text-4xl md:text-5xl font-bold tracking-tight px-0 text-3xl text-slate-950 lg:text-4xl">
                Track Home Improvements, Renovations and DIY Projects &amp;{' '}
                <span style={{
                color: '#0090FF'
              }}>Unlock Hidden Savings</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">
                Smart homeowners use RenovationReceipts to track improvements, unlock tax benefits, and discover hidden savings. Join thousands of property owners who've saved an average of $33,200 on taxes.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/signup" onClick={handleSignUpClick}>
                  <Button size="lg" className="text-base sm:text-lg">
                    Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};