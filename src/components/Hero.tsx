import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Calculator, FileText } from "lucide-react";

export const Hero = () => {
  return (
    <div className="hero-gradient section-padding">
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
            <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <Home className="h-6 w-6 text-blue-600" />
                  <span className="font-semibold">Property Dashboard</span>
                </div>
                <span className="text-green-600 font-semibold">$245,000</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-gray-500" />
                  <span>Cost Basis Calculator</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span>IRS Form 8949 Export</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};