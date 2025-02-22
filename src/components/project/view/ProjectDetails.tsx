
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface ProjectDetailsProps {
  cost: number
  completionDate: string
  builderName: string | null
  builderUrl: string | null
  description: string | null
}

export function ProjectDetails({ 
  cost, 
  completionDate, 
  builderName, 
  builderUrl, 
  description 
}: ProjectDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Project Cost</span>
          <span className="font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(cost)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Completion Date</span>
          <span className="font-medium">
            {format(new Date(completionDate), "MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Builder Name</span>
          <span className="font-medium">
            {builderName || "Not provided"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Builder Website</span>
          <span className="font-medium">
            {builderUrl ? (
              <a 
                href={builderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {builderUrl}
              </a>
            ) : (
              "Not provided"
            )}
          </span>
        </div>
        {description && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-600">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
