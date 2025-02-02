import { CircleIcon } from "lucide-react";

const steps = [
  {
    title: "Create an Account",
    description: "Sign up and securely log in to start tracking your property expenses.",
  },
  {
    title: "Input Property Information",
    description: "Enter your home's purchase details and improvement expenses, categorized by property type.",
  },
  {
    title: "Generate Tax Reports",
    description: "Let the app calculate your cost basis and prepare IRS Form 8949 data automatically.",
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
          <p className="text-xl text-gray-600">
            Three simple steps to optimize your property tax benefits
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -z-10" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};