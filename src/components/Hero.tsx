import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="hero-gradient">
      <nav className="container-width py-4 px-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-900">TaxSmartHome</div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
          <Link to="/signup" className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md">Sign Up</Link>
        </div>
      </nav>
      <div className="section-padding">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 lg:text-6xl">
                Digitize Your Home Improvements & Boost Your Tax Benefits
              </h1>
              <p className="text-xl text-gray-600">
                Track all your home improvement expenses to accurately calculate cost basis—ultimately lowering taxable gains when selling. Perfect for homeowners, second-home owners, and landlords.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="text-lg">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                alt="Tax Smart Home Dashboard Preview"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};