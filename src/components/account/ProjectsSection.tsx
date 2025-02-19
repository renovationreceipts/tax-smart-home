
import { FileText } from "lucide-react";
import type { Project } from "@/hooks/useProjects";
import { useProperties } from "@/hooks/useProperties";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "./project-section/EmptyState";
import { MobileProjectCard } from "./project-section/MobileProjectCard";
import { ProjectsTable } from "./project-section/ProjectsTable";
import { ProjectsHeader } from "./project-section/ProjectsHeader";
import { formatCurrency } from "@/lib/formatters";

interface ProjectsSectionProps {
  propertyId: string | null;
  projects: Project[];
  onAddProject: () => void;
}

export function ProjectsSection({
  propertyId,
  projects,
  onAddProject,
}: ProjectsSectionProps) {
  const navigate = useNavigate();
  const { data: properties = [] } = useProperties();
  const selectedProperty = properties.find(p => p.id === propertyId);
  const totalProjectCosts = projects.reduce((sum, project) => sum + (project.cost || 0), 0);

  if (!propertyId || properties.length === 0) {
    return null;
  }

  const handleViewProject = (project: Project) => {
    navigate(`/project/view/${propertyId}/${project.id}`);
  };

  const handlePropertySelect = (propertyId: string) => {
    navigate(`/account?propertyId=${propertyId}`);
  };

  const handleAddProperty = () => {
    navigate("/property/edit");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="pb-4 sm:pb-0 border-b sm:border-b-0">
        <ProjectsHeader
          selectedProperty={selectedProperty}
          properties={properties}
          hasProjects={projects.length > 0}
          onAddProject={onAddProject}
          onPropertySelect={handlePropertySelect}
          onAddProperty={handleAddProperty}
        />
      </div>

      {projects.length === 0 ? (
        <div className="mt-4">
          <EmptyState onAddProject={onAddProject} />
        </div>
      ) : (
        <div className="mt-4">
          <div className="block sm:hidden -mx-6">
            {projects.map(project => (
              <MobileProjectCard
                key={project.id}
                project={project}
                onViewProject={handleViewProject}
              />
            ))}
            <div className="px-4 py-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">Total Projects Cost</span>
                <span className="text-base font-semibold">{formatCurrency(totalProjectCosts)}</span>
              </div>
            </div>
          </div>
          
          <ProjectsTable
            projects={projects}
            totalProjectCosts={totalProjectCosts}
            onViewProject={handleViewProject}
          />

          <div className="border-t mt-6 pt-6">
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 mt-1 text-gray-600" />
              <h3 className="text-base font-normal">
                You're making a smart choice! All your records are encrypted and securely stored.
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
