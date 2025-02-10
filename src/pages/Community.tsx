
import { Button } from "@/components/ui/button"
import { AccountHeader } from "@/components/account/AccountHeader"
import { Slack, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Community() {
  const navigate = useNavigate()
  
  const handleJoinSlack = () => {
    window.open("https://join.slack.com/t/renovationreceiptscom/shared_invite/zt-2zqln109d-kUwtYrZVj~tdyVtiyGxdhQ", "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <AccountHeader onSignOut={() => {}} />
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/account")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Join Our Community
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Connect with other property owners, share experiences, and get help from our community of experts.
          </p>
          <Button
            size="lg"
            onClick={handleJoinSlack}
            className="w-full sm:w-auto"
          >
            <Slack className="mr-2" />
            Join our Slack Community
          </Button>
        </div>
      </main>
    </div>
  )
}
