import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAllUserProjects } from "@/hooks/useProjects";
import { useInsuranceTemplates } from "@/hooks/useInsuranceTemplates";
import { useToast } from "@/hooks/use-toast";
import { RequestDiscountHeader } from "@/components/request-discount/RequestDiscountHeader";
import { ProjectLoadingSkeleton } from "@/components/request-discount/ProjectLoadingSkeleton";
import { ProjectNotFound } from "@/components/request-discount/ProjectNotFound";
import { ProjectInfo } from "@/components/request-discount/ProjectInfo";
import { TemplatesTabs } from "@/components/request-discount/TemplatesTabs";
import { InsuranceTips } from "@/components/request-discount/InsuranceTips";

export default function RequestDiscount() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const { data: allProjects = [], isLoading: projectsLoading } = useAllUserProjects();
  const project = allProjects.find(p => p.id === projectId);
  const [activeTab, setActiveTab] = useState("call");
  
  const {
    callScript,
    emailTemplate,
    isLoading,
    generateCallScript,
    generateEmailTemplate
  } = useInsuranceTemplates();

  // Track if initial content generation has started
  const [generationStarted, setGenerationStarted] = useState({
    call: false,
    email: false
  });

  useEffect(() => {
    if (project?.description) {
      if (activeTab === "call" && !callScript && !isLoading.call && !generationStarted.call) {
        setGenerationStarted(prev => ({ ...prev, call: true }));
        generateCallScript(project.description);
      } else if (activeTab === "email" && !emailTemplate && !isLoading.email && !generationStarted.email) {
        setGenerationStarted(prev => ({ ...prev, email: true }));
        generateEmailTemplate(project.description);
      }
    }
  }, [project, activeTab, callScript, emailTemplate, isLoading.call, isLoading.email, generationStarted]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The template has been copied to your clipboard."
    });
  };

  // Handle loading states
  const isCallLoading = projectsLoading || (activeTab === "call" && (!callScript && (isLoading.call || !generationStarted.call)));
  const isEmailLoading = projectsLoading || (activeTab === "email" && (!emailTemplate && (isLoading.email || !generationStarted.email)));

  if (projectsLoading) {
    return <ProjectLoadingSkeleton />;
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <RequestDiscountHeader />

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <ProjectInfo project={project} />

          <TemplatesTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            callScript={callScript}
            emailTemplate={emailTemplate}
            isCallLoading={isCallLoading}
            isEmailLoading={isEmailLoading}
            onCopy={handleCopy}
          />
        </div>

        <InsuranceTips />
      </div>
    </div>
  );
}
