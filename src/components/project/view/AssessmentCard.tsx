
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, XCircle } from "lucide-react"

interface AssessmentCardProps {
  title: string
  qualifies: boolean | null
  analysis: string | null
  tooltipContent: string
}

export function AssessmentCard({ title, qualifies, analysis, tooltipContent }: AssessmentCardProps) {
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
        <p className="text-gray-600">
          {analysis || "No assessment available."}
        </p>
      </CardContent>
    </Card>
  )
}
