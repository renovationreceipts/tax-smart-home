import { BarChart2, Calculator, FileText, Shield } from "lucide-react";

const features = [
  {
    icon: <BarChart2 className="h-6 w-6" />,
    title: "Renovation Expense Tracking",
    description: "Record every home improvement—from contractor projects to DIY Home Depot trips—across different property types.",
  },
  {
    icon: <Calculator className="h-6 w-6" />,
    title: "Cost Basis Calculator",
    description: "Automatically update your cost basis, tailored for primary, second, and rental properties.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Tax Reporting Made Easy",
    description: "Automatically export values into IRS Form 8949 for easy download or printing.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "IRS-GPT™",
    description: "View interactive graphs and summaries that consolidate your financial records securely.",
  },
];

export const Features = () => {
  return (
    <div className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Features & Benefits
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 text-blue-600 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};