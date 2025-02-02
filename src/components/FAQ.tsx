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
      answer: "When you're ready to file taxes, our app automatically compiles your cost basis data and generates a completed IRS Form 8949. You can download it as a PDF or print it directly for your records."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. All data is encrypted using bank-level security standards, and we regularly perform security audits. Your information is backed up securely and never shared with third parties."
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
                <AccordionTrigger className="px-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
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