
import { FileText } from "lucide-react";
import type { Project } from "@/hooks/useProjects";
import { useProperties } from "@/hooks/useProperties";
import { useProjectLimitCheck } from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EmptyState } from "./project-section/EmptyState";
import { MobileProjectCard } from "./project-section/MobileProjectCard";
import { ProjectsTable } from "./project-section/ProjectsTable";
import { ProjectsHeader } from "./project-section/ProjectsHeader";
import { formatCurrency } from "@/lib/formatters";
import { PremiumModal } from "@/components/premium/PremiumModal";
import { FREE_TIER_LIMITS } from "@/hooks/usePremiumStatus";

interface ProjectsSectionProps {
  propertyId: string | null;
  projects: Project[];
  onAddProject: () => void;
  onPropertySelect: (propertyId: string) => void;
  isPremium?: boolean;
}

export function ProjectsSection({
  propertyId,
  projects,
  onAddProject,
  onPropertySelect,
  isPremium = false
}: ProjectsSectionProps) {
  const navigate = useNavigate();
  const { data: properties = [] } = useProperties();
  const { projectsCount } = useProjectLimitCheck(isPremium);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  
  const selectedProperty = properties.find(p => p.id === propertyId);
  const totalProjectCosts = projects.reduce((sum, project) => sum + (project.cost || 0), 0);

  if (!propertyId || properties.length === 0) {
    return null;
  }

  const handleViewProject = (project: Project) => {
    navigate(`/project/view/${propertyId}/${project.id}`);
  };

  const handleAddProperty = () => {
    navigate("/property/edit");
  };
  
  const handleAddProject = () => {
    // Changed to >= to show premium modal when reaching the limit of 3 projects
    if (!isPremium && projectsCount >= FREE_TIER_LIMITS.PROJECT_LIMIT) {
      setIsPremiumModalOpen(true);
    } else {
      onAddProject();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="pb-4 sm:pb-0 border-b sm:border-b-0">
        <ProjectsHeader
          selectedProperty={selectedProperty}
          properties={properties}
          hasProjects={projects.length > 0}
          onAddProject={handleAddProject}
          onPropertySelect={onPropertySelect}
          onAddProperty={handleAddProperty}
        />
      </div>

      {projects.length === 0 ? (
        <div className="mt-4">
          <EmptyState onAddProject={handleAddProject} />
        </div>
      ) : (
        <div className="mt-4">
          <MobileProjectCard
            projects={projects}
            totalProjectCosts={totalProjectCosts}
            onViewProject={handleViewProject}
          />
          
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
      
      <PremiumModal
        open={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        propertyCount={properties.length}
        projectCount={projectsCount}
      />
    </div>
  );
}
