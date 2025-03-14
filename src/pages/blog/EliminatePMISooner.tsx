
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const EliminatePMISooner = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container-width py-8 sm:py-12 bg-white px-[15px]">
        <div className="mb-8">
          <Link 
            to="/blog" 
            className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
        
        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">How Home Improvements Can Help You Eliminate PMI Sooner</h1>
            <p className="text-xl text-gray-600 mb-4">Save money by increasing your home's value and lowering your loan-to-value ratio (LTV)</p>
            <time className="text-sm text-gray-500">March 1, 2025</time>
          </header>
          
          <div className="aspect-[16/9] mb-8 overflow-hidden rounded-lg">
            <img 
              src="/lovable-uploads/902eef2d-5840-4c0b-8638-e5093ed3aae0.png" 
              alt="House with calculator showing reduced mortgage insurance" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Failed to load image: /lovable-uploads/902eef2d-5840-4c0b-8638-e5093ed3aae0.png");
                setImageError(true);
              }}
            />
            {imageError && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Image not available</p>
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              If you purchased a home with less than 20% down, you're probably paying Private Mortgage Insurance (PMI) 
              (or Mortgage Insurance Premiums (MIP) if you have an FHA loan). This added cost—typically $30 to $150 per month 
              for every $100,000 borrowed—can stick around for years unless you take action.
            </p>
            
            <p className="mb-6">
              But what if your home improvements could help you remove PMI sooner? That's exactly what smart homeowners are doing.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">How PMI Works (And When You Can Remove It)</h2>
            <p className="mb-4">Most lenders automatically remove PMI when:</p>
            <ul className="list-none space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span> 
                <span>Your loan-to-value (LTV) ratio reaches 78% through regular payments.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span> 
                <span>You request removal when LTV reaches 80% (but you must prove your home's value).</span>
              </li>
            </ul>
            
            <p className="mb-6">
              This is where home improvements come in. If you've added value—like a kitchen remodel, new roof, 
              or energy-efficient upgrades—your home may be worth more than the lender thinks. A higher home value 
              lowers your LTV faster and can get PMI removed much sooner.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">PMI Removal Calculation Example</h2>
            <p className="mb-4">Let's say you:</p>
            <ul className="list-disc pl-5 mb-6">
              <li>Bought your home for $300,000 with 10% down ($30,000).</li>
              <li>Took out a $270,000 mortgage (90% LTV).</li>
              <li>Need to hit 80% LTV ($240,000 loan balance) to remove PMI.</li>
            </ul>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Scenario 1: Waiting it out</h3>
              <ul className="space-y-2 mb-4">
                <li>Paying down the loan normally: 5-7 years before PMI removal.</li>
                <li>Total PMI paid: $5,000+ over time</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-4 mt-6">Scenario 2: Using home improvements to remove PMI</h3>
              <ul className="space-y-2 mb-4">
                <li>You renovate the kitchen and add a deck ($30,000 total).</li>
                <li>New home appraisal comes in at $350,000.</li>
                <li>Your new LTV is $270,000 / $350,000 = 77%.</li>
                <li>PMI can be removed immediately!</li>
              </ul>
              
              <div className="mt-4 bg-blue-50 p-4 rounded-lg inline-block">
                <span className="text-blue-600 font-semibold">🔹 Savings:</span> You stop paying PMI years earlier, saving thousands!
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">How to Use RenovationReceipts.com to Track Home Value Gains</h2>
            <ol className="space-y-4 mb-8">
              <li>
                <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2">1</span>
                <span className="font-medium">Log your home improvement projects (receipts, costs, photos).</span>
              </li>
              <li>
                <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2">2</span>
                <span className="font-medium">Track your estimated LTV and home value.</span>
              </li>
              <li>
                <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2">3</span>
                <span className="font-medium">Get a lender-ready report proving your home's increased value.</span>
              </li>
              <li>
                <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2">4</span>
                <span className="font-medium">Request PMI removal and start saving!</span>
              </li>
            </ol>
            
            <p className="mt-10 mb-6 text-lg">
              Check your potential PMI savings today by tracking your home projects with RenovationReceipts.com.
            </p>
            
            {!isAuthenticated && (
              <div className="mt-8 mb-10">
                <Link 
                  to="/signup" 
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Tracking Your Home Improvements
                </Link>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default EliminatePMISooner;
