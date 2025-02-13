
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const TrackHomeImprovements = () => {
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
            Introducing Renovation Receipts: The Smartest Way to Track Your Home Improvement Expenses & Maximize Tax Savings
          </h1>
          
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Stop Stuffing Receipts in a Filing Cabinet – Go Digital Instead!
          </h2>

          <div className="prose max-w-none">
            <p className="mb-6">
              If you're a homeowner, you've probably made improvements to your home—maybe you added a new deck, replaced old windows, or finally updated that 90s kitchen. But did you know that tracking your home improvement expenses can save you thousands in taxes when you sell your home?
            </p>
            
            <p className="mb-8">Most people don't. And that's where Renovation Receipts comes in.</p>

            <h3 className="text-2xl font-semibold mb-4">🏡 What is Renovation Receipts?</h3>
            
            <p className="mb-6">
              Renovation Receipts is an easy-to-use web app that helps homeowners track, organize, and optimize their home improvement expenses so they can maximize their cost basis and reduce capital gains taxes when they sell.
            </p>

            <p className="mb-6">
              Instead of tossing receipts into a folder (or worse, losing them completely), you can digitally log every home improvement project, store receipts & photos, and get automatic tax calculations to see how much money you're saving.
            </p>

            <ul className="list-none space-y-2 mb-8">
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Log Home Improvement Projects – Track everything from small DIY upgrades to major renovations.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Upload Receipts & Photos – Keep digital records of expenses for tax purposes.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Automatically Calculate Tax Savings – See how your cost basis changes and how much you could save when selling your home.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>IRS-Ready Tax Forms – Generate reports and pre-fill tax documents when it's time to sell.</span>
              </li>
            </ul>

            <h3 className="text-2xl font-semibold mb-4">💡 Why Should You Track Your Home Improvements?</h3>
            
            <p className="mb-6">
              Most homeowners forget that the money they put into their home can actually reduce their tax bill later. When you sell your home, the IRS allows you to increase your home's cost basis with qualifying improvements—lowering your taxable capital gains.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h4 className="font-semibold mb-4">For example:</h4>
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
                      <td className="py-2">Purchase Price</td>
                      <td>$650,000</td>
                      <td>$650,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Home Improvements</td>
                      <td>Unknown 🤷</td>
                      <td>$100,000 (Tracked) ✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Sale Price</td>
                      <td>$1,000,000</td>
                      <td>$1,000,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Cost Basis</td>
                      <td>$650,000</td>
                      <td>$750,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Taxable Gain</td>
                      <td>$350,000</td>
                      <td>$250,000</td>
                    </tr>
                    <tr>
                      <td className="py-2">Federal Tax Owed (15%)</td>
                      <td>$15,000</td>
                      <td>$0 (Fully Exempt) 🎉</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 font-semibold text-primary">💰 By tracking home improvements, this homeowner saved $15,000 in taxes!</p>
            </div>

            <p className="mb-8">
              If you're married and file jointly, you can exclude up to $500,000 in capital gains from taxes. If you're single, you can exclude $250,000. But if you don't track your improvements, you might be leaving money on the table.
            </p>

            <h3 className="text-2xl font-semibold mb-4">🛠 Who is Renovation Receipts For?</h3>
            
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Homeowners who plan to sell in the future and want to maximize tax savings</li>
              <li>DIYers & Renovators who make frequent upgrades and improvements</li>
              <li>Real Estate Investors & Landlords who need to track property improvements for depreciation & capital gains calculations</li>
              <li>Estate Planners & Financially Savvy Homeowners who want to keep organized records</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-4">🚀 Built With AI & Tax-Smart Technology</h3>
            
            <p className="mb-6">
              We built Renovation Receipts using Lovable.dev, Supabase, and OpenAI's fine-tuned AI models to make tax tracking as easy and automated as possible.
            </p>

            <p className="mb-8">
              Our AI-powered tax assistant helps you determine which home projects qualify for cost basis adjustments so you don't have to guess. Plus, we're working on features to automatically generate IRS Form 8949, making tax time even easier.
            </p>

            <h3 className="text-2xl font-semibold mb-4">🎯 Get Started for FREE While We're in Beta!</h3>
            
            <p className="mb-6">
              We're launching Renovation Receipts in beta, which means you can sign up and use it for free while we gather feedback from real homeowners.
            </p>

            <ul className="list-none space-y-2 mb-6">
              <li className="flex items-start">
                <span className="mr-2">🛠</span>
                <span>Try it out, break it, tell us what you love & what you want to see next.</span>
              </li>
            </ul>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-lg font-semibold mb-4">📣 What features would make this tool even better?</p>
              <p>Let us know in our Slack community and help shape the future of home improvement tracking!</p>
            </div>

            <h3 className="text-2xl font-semibold mb-4">Final Thoughts: Start Tracking Now & Save Thousands Later</h3>
            
            <p className="mb-6">
              If you're a homeowner, tracking your renovations isn't just about being organized—it's about saving real money. Whether you plan to sell in 5 years or 20, having digital records of your home projects ensures you get every tax break you deserve.
            </p>

            <p className="text-lg font-semibold">
              Stop guessing. Start tracking. Try Renovation Receipts today. 🚀
            </p>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default TrackHomeImprovements;
