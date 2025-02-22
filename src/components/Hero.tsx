import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X, Calculator, DollarSign, Shield } from "lucide-react";
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
      <div className="w-full sm:py-20 px-4 py-[22px] lg:py-[47px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="space-y-8">
              <h1 className="sm:text-4xl md:text-5xl font-bold tracking-tight px-0 text-3xl text-slate-950 lg:text-4xl">
                Track Home Improvements, Renovations and DIY Projects &amp;{' '}
                <span style={{
                color: '#0090FF'
              }}>Unlock Hidden Savings</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">Join 50,000 property owners who've saved an average of $33,200 on taxes.</p>
              <div className="flex justify-center gap-4">
                <Link to="/signup" onClick={handleSignUpClick}>
                  <Button size="lg" className="text-base sm:text-lg">
                    Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <div className="bg-[#D3E4FD] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6 text-[#0090FF]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tax-Smart Tracking</h3>
                  <p className="text-gray-600">
                    Automatically calculate cost basis and potential tax savings. Our smart system helps you never miss a deductible expense.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <div className="bg-[#DCFCE7] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-[#22C55E]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hidden Credits Finder</h3>
                  <p className="text-gray-600">
                    Discover tax credits and rebates you didn't know about. Our database is updated with the latest federal and state incentives.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <div className="bg-[#F3E8FF] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-[#A855F7]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Insurance Optimizer</h3>
                  <p className="text-gray-600">
                    Get better insurance rates by documenting improvements. Save up to 15% on premiums with detailed property records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};