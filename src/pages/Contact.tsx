
import React from "react";
import { Container } from "@/components/ui/container";

const Contact = () => {
  return (
    <Container className="py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Get in Touch</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Questions, feedback, find a bug? Want to see a new feature or enhancement? Let us know!
          </p>
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
            <p className="text-lg font-medium">Email:</p>
            <a 
              href="mailto:myrenovationreceipts@gmail.com" 
              className="text-primary hover:underline break-words"
            >
              myrenovationreceipts@gmail.com
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Contact;
