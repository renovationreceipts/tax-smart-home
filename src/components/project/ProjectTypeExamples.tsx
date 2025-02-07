
import { ClipboardList } from "lucide-react"

export function ProjectTypeExamples() {
  return (
    <div className="mt-4 space-y-4">
      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <ClipboardList className="h-4 w-4" />
        Common Project Types
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Kitchen Remodeling",
            description: "Cabinets, countertops, appliances, and flooring upgrades",
          },
          {
            title: "Bathroom Renovation",
            description: "Fixtures, tiling, vanities, and plumbing updates",
          },
          {
            title: "Energy Efficiency",
            description: "Solar panels, insulation, and HVAC system improvements",
          },
          {
            title: "Outdoor Improvements",
            description: "Deck construction, landscaping, and outdoor living spaces",
          },
        ].map((example) => (
          <div 
            key={example.title} 
            className="p-3 bg-gray-50 rounded-md border border-gray-100"
          >
            <h5 className="font-medium text-gray-800">{example.title}</h5>
            <p className="text-sm text-gray-600 mt-1">{example.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
