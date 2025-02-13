
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const WhyTrackCosts = () => {
  return (
    <div className="container-width py-16 sm:py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 justify-center text-center">
          <span role="img" aria-label="lightbulb" className="text-3xl">💡</span>
          Why Should You Track Your Home Improvements?
        </h2>
        
        <p className="text-lg text-gray-600 mb-10 text-center">
          Most homeowners forget that the money they put into their home can actually reduce their tax bill later. When you sell your home, the IRS allows you to increase your home's cost basis with qualifying improvements—lowering your taxable capital gains.
        </p>

        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
          <h3 className="font-semibold text-xl mb-6 text-center">For example:</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Scenario</th>
                  <th className="text-left py-2">Without Tracking</th>
                  <th className="text-left py-2">With Renovation Receipts</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">Purchase Price</td>
                  <td>$650,000</td>
                  <td>$650,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Home Improvements</td>
                  <td>Unknown 🤷</td>
                  <td>$100,000 (Tracked) ✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Sale Price</td>
                  <td>$1,000,000</td>
                  <td>$1,000,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Cost Basis</td>
                  <td>$650,000</td>
                  <td>$750,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Taxable Gain</td>
                  <td>$350,000</td>
                  <td>$250,000</td>
                </tr>
                <tr>
                  <td className="py-3">Federal Tax Owed (15%)</td>
                  <td>$15,000</td>
                  <td>$0 (Fully Exempt) 🎉</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-primary font-semibold flex items-center justify-center gap-2">
            <span>💰</span>
            By tracking home improvements, this homeowner saved $15,000 in taxes!
          </p>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhyTrackCosts />
      <HowItWorks />
      <Features />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
