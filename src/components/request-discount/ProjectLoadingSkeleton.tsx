
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function ProjectLoadingSkeleton() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine the title based on the current path
  let title = "Request Insurance Discount";
  if (location.pathname.includes("/tax-form")) {
    title = "Tax Form Information";
  } else if (location.pathname.includes("/turbotax")) {
    title = "TurboTax Instructions";
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
