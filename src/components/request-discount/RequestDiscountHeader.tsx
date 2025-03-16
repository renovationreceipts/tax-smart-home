
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAllUserProjects } from "@/hooks/useProjects";

export function RequestDiscountHeader() {
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
    <div className="flex items-center mb-6">
      <Button 
        variant="ghost" 
        className="mr-2" 
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <h1 className="text-2xl font-bold">Request Insurance Discount</h1>
    </div>
  );
}
