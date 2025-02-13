
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const CapitalGains101 = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-width py-8 sm:py-12">
        <div className="mb-8">
          <Link to="/blog" className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        <article className="bg-white p-8 rounded-lg shadow-sm border">
          <h1 className="text-3xl font-bold mb-6">
            Capital Gains 101: How to Reduce Your Taxable Gain When Selling Your Home
          </h1>

          <div className="prose max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Understanding capital gains tax on your home sale and legal strategies to minimize your tax burden.
            </p>

            <h2 className="text-2xl font-semibold mb-4">What Are Capital Gains on Home Sales?</h2>
            
            <p className="mb-6">
              When you sell your home for more than you paid for it, the profit is considered a capital gain. While this is 
              great news for your wallet, it's important to understand how these gains are taxed and what exemptions are available.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Quick Facts About Home Sale Capital Gains:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Single homeowners can exclude up to $250,000 in gains</li>
                <li>Married couples filing jointly can exclude up to $500,000</li>
                <li>You must have lived in the home as your primary residence for 2 out of the last 5 years</li>
                <li>The exclusion can be used once every two years</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Calculating Your Capital Gains</h2>

            <div className="space-y-4 mb-8">
              <p>The basic formula is:</p>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                Sale Price - (Purchase Price + Improvements + Selling Costs) = Capital Gain
              </div>
              <p>
                This is where tracking your home improvements becomes crucial—every qualified improvement 
                increases your cost basis and reduces your taxable gain.
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Strategies to Reduce Your Capital Gains Tax</h2>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Track All Qualifying Improvements</h3>
                <p>
                  Use RenovationReceipts.com to document and organize all your home improvements. Every dollar spent on 
                  qualifying improvements reduces your taxable gain by increasing your cost basis.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Time Your Sale Strategically</h3>
                <p>
                  Ensure you meet the 2-out-of-5-years residency requirement to qualify for the maximum exclusion. 
                  Plan your sale timing accordingly.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Keep Detailed Records</h3>
                <p>
                  Maintain comprehensive documentation of your purchase price, improvement costs, and selling expenses. 
                  Digital records are easier to maintain and access when needed.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Real-World Example: The Impact of Tracking Improvements</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Case Study: The Martinez Family</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Without Tracking:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Purchase Price: $400,000</li>
                      <li>Sale Price: $800,000</li>
                      <li>Capital Gain: $400,000</li>
                      <li>Taxable Amount: $0 (covered by exclusion)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">With Tracking:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Purchase Price: $400,000</li>
                      <li>Improvements: $150,000</li>
                      <li>Sale Price: $800,000</li>
                      <li>Capital Gain: $250,000</li>
                      <li>Taxable Amount: $0</li>
                    </ul>
                  </div>
                </div>
                <p className="text-primary font-semibold">
                  Result: Better documentation for tax purposes and increased resale value justification!
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Common Questions About Capital Gains</h2>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Q: What if I've owned multiple homes?</h3>
                <p>
                  The exclusion applies to your primary residence. You must meet the 2-out-of-5-years requirement 
                  for each property to claim the exclusion.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Q: Do I need to report the sale if I'm within the exclusion limit?</h3>
                <p>
                  Yes, you still need to report the sale on your tax return, even if no tax is due. Proper documentation 
                  is essential.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Q: What if my gain exceeds the exclusion amount?</h3>
                <p>
                  This is where tracking improvements becomes crucial. Every qualified improvement increases your cost 
                  basis and reduces your taxable gain.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Start Tracking Today</h2>

            <p className="mb-6">
              Don't wait until you're ready to sell to start documenting your home improvements. The sooner you begin 
              tracking, the more prepared you'll be when it's time to calculate your capital gains.
            </p>

            <div className="bg-primary/5 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Ready to maximize your tax savings?</h3>
              <p className="mb-4">Join RenovationReceipts.com today and:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Track all your home improvements in one place</li>
                <li>Calculate potential tax savings</li>
                <li>Generate comprehensive reports for tax time</li>
                <li>Access expert guidance on qualifying improvements</li>
              </ul>
            </div>

            <Link 
              to="/signup" 
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Your Free Account
            </Link>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default CapitalGains101;
