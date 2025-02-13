
import { ArrowLeft, LayoutDashboard, Receipt, Camera, Calculator, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const detailedFeatures = [
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: "Digital Document Vault",
    description: "Say goodbye to filing cabinets. Our secure digital vault keeps all your renovation documentation organized and accessible.",
  },
  {
    icon: <Receipt className="h-6 w-6" />,
    title: "Receipt & Invoice Storage",
    description: "Store and organize all your receipts and invoices in one place. Never lose track of your renovation expenses again.",
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Before & After Photos",
    description: "Document your renovation journey with before and after photos, creating a visual record of your improvements.",
  },
  {
    icon: <Calculator className="h-6 w-6" />,
    title: "Tax Savings Calculator",
    description: "Our smart calculator helps you understand potential tax savings from your home improvements.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "IRS Qualification Check",
    description: "We help determine if your project qualifies for tax benefits based on current IRS guidelines.",
  }
];

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-width py-8 sm:py-12">
        <div className="mb-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Features & Benefits</h1>
          <p className="text-gray-600 text-lg">
            Discover how our app simplifies home improvement documentation and maximizes your tax benefits.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {detailedFeatures.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h2 className="text-xl font-semibold">{feature.title}</h2>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
