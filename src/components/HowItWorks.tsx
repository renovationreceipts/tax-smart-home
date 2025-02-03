import { Receipt, Calculator, FileSpreadsheet } from "lucide-react";

const steps = [
  {
    icon: <Receipt className="h-6 w-6 text-blue-600" />,
    title: "Track Home Improvements",
    description: "Easily document all your capital improvements with receipts, descriptions, and costs in one organized place.",
  },
  {
    icon: <Calculator className="h-6 w-6 text-blue-600" />,
    title: "Calculate Cost Basis",
    description: "Automatically compute your adjusted cost basis by combining purchase price and improvement costs.",
  },
  {
    icon: <FileSpreadsheet className="h-6 w-6 text-blue-600" />,
    title: "Prepare Tax Documents",
    description: "Generate accurate tax forms and maintain organized records for potential IRS audits.",
  },
];

export const HowItWorks = () => {
  return (
    <div className="section-padding bg-gray-50">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            How This Business Can Help
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your property expense tracking, maximize tax benefits, and maintain organized records for your peace of mind.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -z-10" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
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