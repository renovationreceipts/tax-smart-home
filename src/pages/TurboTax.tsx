
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAllUserProjects } from "@/hooks/useProjects";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIRSCredits } from "@/hooks/useIRSCredits";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function TurboTax() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: allProjects = [], isLoading: projectsLoading } = useAllUserProjects();
  const project = allProjects.find(p => p.id === projectId);
  const { credits, updateCreditsUsed } = useIRSCredits();

  const [instructions, setInstructions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project?.description && !instructions && !isLoading && credits?.used < credits?.limit) {
      generateTurboTaxInstructions();
    }
  }, [project, instructions, isLoading, credits]);

  const generateTurboTaxInstructions = async () => {
    if (!project?.description) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-turbotax-instructions', {
        body: { 
          projectDescription: project.description,
          projectCost: project.cost,
          completionDate: project.completion_date
        }
      });

      if (error) throw error;
      setInstructions(data.text);
      updateCreditsUsed();
    } catch (err) {
      console.error("Error generating TurboTax instructions:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate TurboTax instructions. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!instructions) return;
    
    navigator.clipboard.writeText(instructions);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The TurboTax instructions have been copied to your clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button variant="outline" onClick={handleBack} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Project not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="outline" onClick={handleBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-2xl font-bold mb-6">TurboTax Instructions</h1>
        
        <Card className="mb-6">
          <CardContent className="pt-6 relative">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="md" />
              </div>
            ) : instructions ? (
              <>
                <div className="whitespace-pre-line">
                  {instructions}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="absolute top-4 right-4" 
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </>
            ) : credits?.used >= credits?.limit ? (
              <div className="py-8 text-center">
                <p className="text-gray-600 mb-4">
                  You've reached your limit of {credits.limit} AI tax assistance requests.
                </p>
                <Button variant="default" onClick={() => navigate("/profile")}>
                  Upgrade to Premium
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Failed to generate TurboTax instructions. Please try refreshing the page.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
