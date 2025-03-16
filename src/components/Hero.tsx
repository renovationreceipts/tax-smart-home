import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, DollarSign, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useIsMobile } from "@/hooks/use-mobile";
export const Hero = () => {
  const {
    trackEvent
  } = useAnalytics();
  const isMobile = useIsMobile();
  const handleSignUpClick = () => {
    trackEvent({
      eventName: "signup_click",
      eventType: "click",
      eventData: {
        location: "hero_section"
      }
    });
  };
  return <div className="w-full hero-gradient">
      <div className="w-full sm:py-20 px-4 py-[22px] lg:py-[47px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="space-y-8">
              <h1 className="sm:text-4xl md:text-5xl font-bold tracking-tight px-0 text-3xl text-slate-950 lg:text-4xl">
                Still Keeping Home Improvement Receipts in a Filing Cabinet? Convert &amp;{' '}
                <span style={{
                color: '#0090FF'
              }}>Save Thousands!</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">Join 50,000 homeowners who've digitized their receipts and uncovered an average tax savings of $33,200.</p>
              <div className="flex flex-col items-center justify-center gap-2">
                <Link to="/signup" onClick={handleSignUpClick}>
                  <Button size="lg" className="text-base sm:text-lg">
                    Turn Receipts into Savings – Free! <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 mt-1">No credit card required</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <div className="bg-[#D3E4FD] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6 text-[#0090FF]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Home Improvement Projects Tracker</h3>
                  <p className="text-gray-600">Track your home projects, save invoices and receipts, before &amp; after photos and we'll automatically calculate your cost basis.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <div className="bg-[#DCFCE7] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-[#22C55E]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hidden Tax Credits Finder</h3>
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