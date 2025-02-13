
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const HomeownersGuideTaxSavings = () => {
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
            The Homeowner's Guide to Tax Savings: Tracking Renovations the Smart Way
          </h1>

          <div className="prose max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              A comprehensive guide to maximizing your tax benefits through strategic renovation tracking and documentation.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Understanding Cost Basis: Your Key to Tax Savings</h2>
            
            <p className="mb-6">
              Your home's cost basis is more than just the purchase price—it's a powerful tool for reducing your capital gains taxes when you sell. By understanding and properly tracking your renovations, you can significantly increase your cost basis and potentially save thousands in taxes.
            </p>

            <h2 className="text-2xl font-semibold mb-4">What Qualifies as a Tax-Deductible Home Improvement?</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">✅ Qualifying Improvements:</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Room additions or home expansions</li>
                <li>New roof installation</li>
                <li>Kitchen and bathroom remodels</li>
                <li>HVAC system upgrades</li>
                <li>Window and door replacements</li>
                <li>Basement finishing</li>
                <li>Garage additions</li>
                <li>New plumbing or electrical systems</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">❌ Non-Qualifying Expenses:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Regular repairs and maintenance</li>
                <li>Painting and decorating</li>
                <li>Landscaping (with some exceptions)</li>
                <li>Cleaning and housekeeping</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Smart Documentation: The 3-Step System</h2>

            <ol className="list-decimal pl-6 space-y-4 mb-8">
              <li>
                <strong>Digital Receipt Storage</strong>
                <p>Store all renovation receipts digitally, organized by project and date. Use RenovationReceipts.com to automatically categorize and track your expenses.</p>
              </li>
              <li>
                <strong>Project Documentation</strong>
                <p>Take before and after photos of improvements. Keep contracts, permits, and correspondence with contractors.</p>
              </li>
              <li>
                <strong>Maintain a Project Log</strong>
                <p>Record project details, dates, costs, and contractor information for each improvement.</p>
              </li>
            </ol>

            <h2 className="text-2xl font-semibold mb-4">Real-World Tax Savings Example</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Case Study: The Johnson Family</h3>
              <p className="mb-4">Purchased home in 2010: $400,000</p>
              <p className="mb-4">Documented improvements over 12 years:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Kitchen remodel: $65,000</li>
                <li>New HVAC system: $12,000</li>
                <li>Bathroom updates: $28,000</li>
                <li>Roof replacement: $15,000</li>
                <li>Window replacements: $22,000</li>
              </ul>
              <p className="font-semibold">Total improvements: $142,000</p>
              <p className="font-semibold">New cost basis: $542,000</p>
              <p className="mt-4 text-primary font-semibold">
                Result: Reduced capital gains by $142,000 when selling, potentially saving over $21,300 in taxes (at 15% capital gains rate)!
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Common Questions About Home Improvement Tax Tracking</h2>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Q: How long should I keep renovation receipts?</h3>
                <p>Keep records for at least three years after selling your home. However, we recommend keeping them indefinitely in digital format.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Q: What if I've lost some receipts?</h3>
                <p>While original receipts are best, you can also use bank statements, credit card statements, and contractor documentation as supporting evidence.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Q: Can I include labor costs?</h3>
                <p>Yes! Both materials and professional labor costs count toward your cost basis.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Start Tracking Today</h2>

            <p className="mb-6">
              Don't wait until you're ready to sell to start tracking your home improvements. Set up a digital tracking system now to ensure you don't miss out on valuable tax savings later.
            </p>

            <div className="bg-primary/5 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Ready to maximize your tax savings?</h3>
              <p className="mb-4">Create your free RenovationReceipts.com account today and:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Easily upload and organize renovation receipts</li>
                <li>Track project costs and improvements</li>
                <li>Calculate potential tax savings</li>
                <li>Generate IRS-ready reports</li>
              </ul>
            </div>

            <Link 
              to="/signup" 
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Tracking Your Renovations
            </Link>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default HomeownersGuideTaxSavings;
