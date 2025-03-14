
import React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-16">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/account")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-semibold">Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-lg mb-6">
                Questions, feedback, find a bug? Want to see a new feature or enhancement? Let us know!
              </p>
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <p className="text-lg font-medium">Email:</p>
                <a 
                  href="mailto:myrenovationreceipts@gmail.com" 
                  className="text-primary hover:underline break-words"
                >
                  myrenovationreceipts@gmail.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default Contact;
