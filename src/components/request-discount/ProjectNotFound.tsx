
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ProjectNotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
}
