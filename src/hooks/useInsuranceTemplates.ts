
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useInsuranceTemplates() {
  const [callScript, setCallScript] = useState<string | null>(null);
  const [emailTemplate, setEmailTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{call: boolean, email: boolean}>({
    call: false,
    email: false
  });
  const { toast } = useToast();

  const generateTemplate = async (projectDescription: string, type: 'call' | 'email') => {
    try {
      setIsLoading(prev => ({ ...prev, [type]: true }));
      
      const { data, error } = await supabase.functions.invoke('generate-insurance-templates', {
        body: { projectDescription, templateType: type }
      });

      if (error) {
        throw error;
      }

      if (type === 'call') {
        setCallScript(data.text);
      } else {
        setEmailTemplate(data.text);
      }

      return data.text;
    } catch (error) {
      console.error(`Error generating ${type} template:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate ${type} template. Please try again.`,
      });
      return null;
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return {
    callScript,
    emailTemplate,
    isLoading,
    generateCallScript: (description: string) => generateTemplate(description, 'call'),
    generateEmailTemplate: (description: string) => generateTemplate(description, 'email'),
  };
}
