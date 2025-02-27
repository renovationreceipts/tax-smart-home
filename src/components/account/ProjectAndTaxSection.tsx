
import { useNavigate } from "react-router-dom";
import { ProjectsSection } from "@/components/account/ProjectsSection";
import { WhySaveRecords } from "@/components/account/WhySaveRecords";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/hooks/useProjects";

interface ProjectAndTaxSectionProps {
  selectedPropertyId: string | null;
  selectedProperty: any;
  onPropertySelect: (propertyId: string) => void;
  isPremium?: boolean;
}

export function ProjectAndTaxSection({
  selectedPropertyId,
  selectedProperty,
  onPropertySelect,
  isPremium = false
}: ProjectAndTaxSectionProps) {
  const navigate = useNavigate();
  const {
    data: projects = []
  } = useProjects(selectedPropertyId);

  return (
    <div className="space-y-4 sm:space-y-6">
      <ProjectsSection 
        propertyId={selectedPropertyId} 
        projects={projects} 
        onAddProject={() => navigate(`/project/edit/${selectedPropertyId}`)}
        onPropertySelect={onPropertySelect}
        isPremium={isPremium}
      />
      <WhySaveRecords />
    </div>
  );
}
