import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProjectForm } from "@/components/project/ProjectForm";
import { useState, useEffect } from "react";
import type { Project } from "@/hooks/useProjects";

export default function EditProject() {
  const { propertyId, id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get any prefilled values from the URL (from receipt upload)
  const prefilledName = searchParams.get('name');
  const prefilledDescription = searchParams.get('description');
  const prefilledCost = searchParams.get('cost');
  const prefilledDate = searchParams.get('date');
  const prefilledBuilder = searchParams.get('builder');

  useEffect(() => {
    if (!propertyId) {
      navigate("/account");
      return;
    }

    if (id) {
      setIsLoading(true);

      const fetchProject = async () => {
        try {
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;

          if (!data) {
            toast({
              variant: "destructive",
              title: "Project not found",
              description: "The project you're trying to edit does not exist.",
            });
            navigate(`/account?propertyId=${propertyId}`);
            return;
          }

          setProject(data);
        } catch (error) {
          console.error("Error fetching project:", error);
          toast({
            variant: "destructive",
            title: "Error fetching project",
            description: "There was a problem loading the project data.",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchProject();
    } else if (prefilledName || prefilledCost || prefilledDate) {
      // If we have prefilled data from receipt, create a prefilled project object
      // We don't save it to the database yet, just use it to prefill the form
      setProject({
        id: "",
        property_id: propertyId,
        user_id: "",
        name: prefilledName || "New Project",
        description: prefilledDescription || "",
        cost: prefilledCost ? parseFloat(prefilledCost.replace(/[^0-9.-]/g, "")) : 0,
        completion_date: prefilledDate ? new Date(prefilledDate).toISOString() : new Date().toISOString(),
        created_at: "",
        updated_at: "",
        builder_name: prefilledBuilder || "",
        builder_url: "",
        qualifies_for_basis: false,
        tax_credits_eligible: false,
        insurance_reduction_eligible: false,
      });
    }
  }, [id, propertyId, navigate, toast, prefilledName, prefilledDescription, prefilledCost, prefilledDate, prefilledBuilder]);

  const handleSuccess = (project: {
    id: string;
    name: string;
    cost: number;
    qualifies_for_basis: boolean;
    tax_credits_eligible: boolean;
    insurance_reduction_eligible: boolean;
  }) => {
    navigate(`/account?propertyId=${propertyId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block mx-auto">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-sm text-gray-500">Loading project data...</p>
        </div>
      </div>
    );
  }

  if (!propertyId) {
    return null;
  }

  return (
    <ProjectForm
      propertyId={propertyId}
      project={project}
      onSuccess={handleSuccess}
      onCancel={() => navigate(`/account?propertyId=${propertyId}`)}
    />
  );
}
