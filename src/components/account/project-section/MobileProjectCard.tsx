
import { Button } from "@/components/ui/button";
import type { Project } from "@/hooks/useProjects";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface MobileProjectCardProps {
  project: Project;
  onViewProject: (project: Project) => void;
}

export function MobileProjectCard({ project, onViewProject }: MobileProjectCardProps) {
  return (
    <div 
      className="border-b last:border-b-0 py-6 first:pt-2 last:pb-2 px-4 space-y-4" 
      onClick={() => onViewProject(project)}
    >
      <h3 className="text-xl font-bold">{project.name}</h3>
      <div className="space-y-1 text-base">
        <div className="flex justify-between">
          <span className="text-gray-600">Project Cost:</span>
          <span className="font-medium">{formatCurrency(project.cost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Completion Date:</span>
          <span className="font-medium">{formatDate(project.completion_date)}</span>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="w-full text-primary hover:text-primary" 
        onClick={e => {
          e.stopPropagation();
          onViewProject(project);
        }}
      >
        View Project
      </Button>
    </div>
  );
}
