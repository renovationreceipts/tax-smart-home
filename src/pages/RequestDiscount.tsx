
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAllUserProjects } from "@/hooks/useProjects";
import { useInsuranceTemplates } from "@/hooks/useInsuranceTemplates";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Phone, Mail } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

export default function RequestDiscount() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: allProjects = [] } = useAllUserProjects();
  const project = allProjects.find(p => p.id === projectId);
  const [activeTab, setActiveTab] = useState("call");
  
  const {
    callScript,
    emailTemplate,
    isLoading,
    generateCallScript,
    generateEmailTemplate
  } = useInsuranceTemplates();

  useEffect(() => {
    if (project?.description) {
      if (activeTab === "call" && !callScript && !isLoading.call) {
        generateCallScript(project.description);
      } else if (activeTab === "email" && !emailTemplate && !isLoading.email) {
        generateEmailTemplate(project.description);
      }
    }
  }, [project, activeTab]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The template has been copied to your clipboard."
    });
  };

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold">Request Insurance Discount</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">
            Project: {project.name}
          </h2>
          <p className="text-gray-600 mb-4">
            Based on our analysis, your {project.name} project may qualify for an insurance premium discount. Use the templates below to contact your insurance provider.
          </p>

          <Tabs defaultValue="call" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="call" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Call Script
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Template
              </TabsTrigger>
            </TabsList>

            <TabsContent value="call" className="mt-0">
              <div className="bg-gray-50 p-4 rounded-md">
                {isLoading.call ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : callScript ? (
                  <div className="relative">
                    <div className="whitespace-pre-line">
                      {callScript}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="absolute top-0 right-0" 
                      onClick={() => handleCopy(callScript)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Script
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Failed to generate call script. Please try refreshing the page.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="email" className="mt-0">
              <div className="bg-gray-50 p-4 rounded-md">
                {isLoading.email ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : emailTemplate ? (
                  <div className="relative">
                    <div className="whitespace-pre-line">
                      {emailTemplate}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="absolute top-0 right-0" 
                      onClick={() => handleCopy(emailTemplate)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Email
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Failed to generate email template. Please try refreshing the page.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <h3 className="text-md font-medium text-blue-800 mb-2">Tips when contacting your insurance company:</h3>
          <ul className="list-disc pl-5 text-blue-700 space-y-1">
            <li>Have your policy number ready</li>
            <li>Be prepared to provide specific details about your improvement</li>
            <li>Ask if they need any documentation or photos of the completed project</li>
            <li>If they decline, ask what types of improvements would qualify for discounts</li>
            <li>Consider shopping around if your current provider doesn't offer a discount</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
