import { Container } from "@/components/ui/container";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function About() {
  const navigate = useNavigate();
  return <Container className="py-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="max-w-3xl mx-auto space-y-8">
        <section>
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          <p className="text-base mb-6">
            It all started with an old house, a long list of projects, and way too many trips to Home Depot.
          </p>
          <div className="space-y-4">
            <p className="text-base">Like many homeowners, I found myself tackling renovations—some big, some small, some DIY, and some with contractors. Every project came with receipts, invoices, and expenses that piled up in a filing cabinet (or got lost in a drawer somewhere). When tax season rolled around, I knew some of these expenses would also qualify for credits, but tracking everything was a nightmare. I also knew the I should save these receipts as they would add to my cost basis in the event we ever sold the house in the future.</p>
            <p className="text-base">
              I searched for a tool that could organize renovation receipts, track expenses, and generate tax-friendly reports, but nothing fit my needs. So, I decided to build it myself.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">A Project That Became Something Bigger</h2>
          <p className="text-base mb-6">
            This started as a personal challenge—a chance to play with AI and new tech tools while solving a real problem. Along the way, I've learned a ton:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
              <span>What qualifies for cost basis (IRS rules are tricky, but we're figuring it out together)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
              <span>How to fine-tune OpenAI's models to analyze home improvement projects for tax purposes</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
              <span>How to build a full-stack app with Lovable.dev (amazing, by the way!)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
              <span>Setting up Supabase for authentication and database management</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
              <span>Configuring SMTP email so that auth emails actually come from my own domain</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
              <span>Deploying everything via Netlify and making it simple for real users to access</span>
            </li>
          </ul>
          <p className="text-base">Now, this project is live in beta, and it's your chance to shape it.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">We Need Your Feedback</h2>
          <div className="space-y-4">
            <p className="text-base">This tool is for homeowners like you—so your input is critical. Please don't hesitate to reach out with feature requests, suggestions or any bugs you find.</p>
            <p className="text-base">
              Thanks for being part of the journey! 🚀
            </p>
            <p className="text-base font-medium"></p>
          </div>
        </section>
      </div>
    </Container>;
}