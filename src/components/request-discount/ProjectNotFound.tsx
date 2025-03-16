
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useAllUserProjects } from "@/hooks/useProjects";

export function ProjectNotFound() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { data: allProjects = [] } = useAllUserProjects();
  
  // Find the project and its property ID
  const project = allProjects.find(p => p.id === projectId);
  
  const handleBack = () => {
    if (project) {
      // Navigate directly to the project details page
      navigate(`/project/view/${project.property_id}/${projectId}`);
    } else {
      // Fallback to navigate(-1) if project not found
      navigate(-1);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Button onClick={handleBack}>Go Back</Button>
      </div>
    </div>
  );
}
