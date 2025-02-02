import { Home, Hammer, FileText } from "lucide-react";

const steps = [
  {
    icon: <Home className="h-6 w-6 text-blue-600" />,
    title: "Input Property Details",
    description: "Add your property information including purchase date, price, and property type.",
  },
  {
    icon: <Hammer className="h-6 w-6 text-blue-600" />,
    title: "Add and Track Capital Improvements",
    description: "Record and categorize all property improvements and their associated costs.",
  },
  {
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    title: "Generate Tax Forms",
    description: "Automatically calculate cost basis and prepare data for IRS Form 8949.",
  },
];

export const HowItWorks = () => {
  return (
    <div className="section-padding bg-gray-50">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            How It Works
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -z-10" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};