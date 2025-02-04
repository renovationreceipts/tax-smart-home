import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="hero-gradient">
      <nav className="container-width py-4 px-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-900">CompanyName</div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
          <Link to="/signup" className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md">Sign Up</Link>
        </div>
      </nav>
      <div className="section-padding">
        <div className="container-width">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 lg:text-6xl">
                Track Home Renovations, Maximize Your Cost Basis, Slash Your Tax Bill
              </h1>
              <p className="text-xl text-gray-600">
                Track all your home improvement expenses to accurately calculate cost basis—ultimately lowering taxable gains when selling. Perfect for homeowners, second-home owners, and landlords.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/signup">
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