
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface AssessmentCardProps {
  title: string
  qualifies: boolean | null
  analysis: string | null
  tooltipContent: string
  projectId?: string
}

export function AssessmentCard({ title, qualifies, analysis, tooltipContent, projectId }: AssessmentCardProps) {
  const navigate = useNavigate()
  
  const renderQualificationStatus = () => {
    if (qualifies === null) return null;
    
    return (
      <div className="flex items-center gap-2">
        {qualifies ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span className={qualifies ? "text-green-700" : "text-red-700"}>
          {qualifies ? "Likely Eligible" : "Likely Not Eligible"}
        </span>
      </div>
    );
  };

  const handleRequestDiscount = () => {
    if (projectId) {
      navigate(`/request-discount/${projectId}`);
    }
  };

  const handleFindTaxForm = () => {
    if (projectId) {
      navigate(`/tax-form/${projectId}`);
    }
  };

  const handleTurboTaxInstructions = () => {
    if (projectId) {
      navigate(`/turbotax/${projectId}`);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {renderQualificationStatus()}
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          {analysis || "No assessment available."}
        </p>
        
        {title === "Insurance Premium Assessment" && qualifies && projectId && (
          <div className="flex justify-end">
            <Button 
              variant="default" 
              className="mt-2" 
              onClick={handleRequestDiscount}
            >
              Request My Discount
            </Button>
          </div>
        )}

        {title === "Tax Credits Assessment" && qualifies && projectId && (
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={handleFindTaxForm}
            >
              Find My Tax Form
            </Button>
            <Button 
              variant="default" 
              className="mt-2" 
              onClick={handleTurboTaxInstructions}
            >
              TurboTax Instructions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
