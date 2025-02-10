
import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function About() {
  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <section>
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          <p className="text-lg text-muted-foreground mb-6">
            It all started with an old house, a long list of projects, and way too many trips to Home Depot.
          </p>
          <Card className="p-6">
            <p className="leading-relaxed mb-4">
              Like many homeowners, we found ourselves tackling renovations—some big, some small, some DIY, and some with contractors. Every project came with receipts, invoices, and expenses that piled up in a filing cabinet (or got lost in a drawer somewhere). When tax season rolled around, I knew some of these expenses would also qualify for credits, but tracking everything was a nightmare. I know knew the I should save these receipts as they would add to my cost basis in the event we ever sold the house in the future.
            </p>
            <p className="leading-relaxed">
              I searched for a tool that could organize renovation receipts, track expenses, and generate tax-friendly reports, but nothing fit my needs. So, I decided to build it myself.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">A Project That Became Something Bigger</h2>
          <p className="text-muted-foreground mb-6">
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
          <p className="text-lg">Now, this project is live in beta, and it's your chance to shape it.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">We Need Your Feedback</h2>
          <Card className="p-6 space-y-4">
            <p className="leading-relaxed">
              This tool is for homeowners like you—so your input is critical. We've integrated Slack for feedback and feature requests, so if you sign up now, you can help define what this product becomes. Whether it's better cost basis tracking, smarter receipt management, or more tax-saving insights, we're listening.
            </p>
            <p className="leading-relaxed">
              Thanks for being part of the journey! 🚀
            </p>
            <p className="font-medium">
              Join the beta, track your projects, and help us build something great.
            </p>
          </Card>
        </section>
      </div>
    </Container>
  )
}
