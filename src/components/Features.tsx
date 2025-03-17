
import { BarChart2, Calculator, FileText, BrainCog } from "lucide-react";

const features = [{
  icon: <BarChart2 className="h-6 w-6" />,
  title: "Track Every Dollar Spent on Home Improvements",
  description: "Keep all your renovation expenses—big or small—organized in one place with receipts, descriptions, and costs at your fingertips."
}, {
  icon: <Calculator className="h-6 w-6" />,
  title: "Automatically Update Your Property's Value",
  description: "Instantly calculate your home's true cost basis by factoring in improvement costs—ensuring you get the most out of your investment when it's time to sell."
}, {
  icon: <BrainCog className="h-6 w-6" />,
  title: "Find Hidden Tax Credits and Insurance Savings",
  description: "Our AI scans your projects to unlock tax credits, and lower insurance premiums—so you never leave money on the table."
}, {
  icon: <FileText className="h-6 w-6" />,
  title: "Generate Instant Reports When You Need Them",
  description: "Need proof of home improvements for taxes, insurance, or resale? Download a clean, professional PDF in seconds—no more digging through old receipts."
}];

export const Features = () => {
  return <div className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">Stay Organized, Maximize Savings</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-blue-600 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 whitespace-pre-line">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </div>;
};
