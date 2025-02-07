
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

export const Hero = () => {
  const { trackEvent } = useAnalytics();

  const handleSignUpClick = () => {
    trackEvent({
      eventName: "signup_click",
      eventType: "click",
      eventData: { location: "hero_section" }
    });
  };

  const handleLoginClick = () => {
    trackEvent({
      eventName: "login_click",
      eventType: "click",
      eventData: { location: "hero_section" }
    });
  };

  return (
    <div className="w-full hero-gradient">
      <nav className="w-full max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
        <div>
          <img 
            src="/lovable-uploads/69bafa75-cbb8-49f9-a552-21142b9fa060.png" 
            alt="RenovationReceipts.com"
            className="h-16 w-auto"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Link 
            to="/login" 
            className="text-gray-600 hover:text-gray-900"
            onClick={handleLoginClick}
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md"
            onClick={handleSignUpClick}
          >
            Sign Up
          </Link>
        </div>
      </nav>
      <div className="w-full py-16 sm:py-20 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 lg:text-6xl">
                Track Home Renovations, Maximize Your Cost Basis, Slash Your Tax Bill
              </h1>
              <p className="text-xl text-gray-600">
                Track all your home improvement expenses to accurately calculate cost basis—ultimately lowering taxable gains when selling. Perfect for homeowners, second-home owners, and landlords.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/signup" onClick={handleSignUpClick}>
                  <Button size="lg" className="text-lg">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
