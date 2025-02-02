import { Home, Calculator, FileText, PieChart } from "lucide-react";

const features = [
  {
    icon: <Home className="h-6 w-6" />,
    title: "Expense Tracking",
    description: "Record every home improvement—from contractor projects to DIY Home Depot trips.",
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
    icon: <PieChart className="h-6 w-6" />,
    title: "User-Friendly Dashboard",
    description: "View interactive graphs and summaries that consolidate your financial records.",
  },
];

export const Features = () => {
  return (
    <div className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Powerful Features for Property Owners
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to track improvements and maximize tax benefits
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};