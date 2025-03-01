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
      answer: "Renovation Receipts uses AI trained on IRS rules and regulations, specifically IRS Publication 523, to determine if each project you enter meets the qualifications for basis adjustment. The app will clearly highlight if your project is likely to qualify and only use qualifying projects in the cost basis calculation."
    },
    {
      question: "Which home improvement expenses can I track?",
      answer: "You can track any capital improvements that add value to your property, including renovations, additions, new systems (HVAC, plumbing, electric), and major upgrades. The app helps distinguish between deductible repairs and capital improvements."
    },
    {
      question: "How do you find savings?",
      answer: "Once you enter a home project, we use a fine-tuned GPT 4o model to analyze the description and find you hidden savings."
    },
    {
      question: "How much does this cost?",
      answer: "Renovation Receipts is free up to 4 home improvement projects and up to 1 property. After that, if you have more projects or properties to manage it's just $20 per year."
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
