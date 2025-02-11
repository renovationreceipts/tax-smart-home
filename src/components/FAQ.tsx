
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How does the app calculate cost basis for different property types?",
      answer: "Our app uses specific algorithms tailored to each property type (primary residence, second home, or rental property) to calculate the cost basis according to IRS guidelines. It factors in the purchase price, closing costs, and all qualifying improvements while accounting for depreciation where applicable."
    },
    {
      question: "Which home improvement expenses can I track?",
      answer: "You can track any capital improvements that add value to your property, including renovations, additions, new systems (HVAC, plumbing, electric), and major upgrades. The app helps distinguish between deductible repairs and capital improvements."
    },
    {
      question: "How does the IRS Form 8949 export work?",
      answer: "When you're ready to file taxes, our app automatically compiles your cost basis data and generates the information you need to fill our Form 8949. You can download it as a PDF or print it directly for your records."
    },
    {
      question: "Why is this free?",
      answer: "Renovation Receipts is currently in beta, which means we're actively building, improving, and refining the platform. We want to make sure we create the best possible tool for homeowners to track their home improvement expenses and maximize their tax savings.\n\nBy signing up now, you get free access to the app and the opportunity to shape its future. Your feedback helps us fine-tune features, improve the user experience, and add new tools that truly make a difference.\n\nThis is our way of thanking early users for trying it out and sharing their insights. Down the road, we may introduce paid plans, but everyone who joins during the beta will continue to enjoy their access for free."
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-width">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border">
                <AccordionTrigger className="text-left px-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-left px-6 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
