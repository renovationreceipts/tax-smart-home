
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail } from "lucide-react";
import { TemplateContent } from "./TemplateContent";

interface TemplatesTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  callScript: string | null;
  emailTemplate: string | null;
  isCallLoading: boolean;
  isEmailLoading: boolean;
  onCopy: (text: string) => void;
}

export function TemplatesTabs({
  activeTab,
  onTabChange,
  callScript,
  emailTemplate,
  isCallLoading,
  isEmailLoading,
  onCopy
}: TemplatesTabsProps) {
  return (
    <Tabs defaultValue="call" value={activeTab} onValueChange={onTabChange} className="w-full">
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
        <div className="bg-gray-50 p-4 rounded-md min-h-[200px]">
          <TemplateContent 
            isLoading={isCallLoading}
            content={callScript}
            type="script"
            onCopy={onCopy}
          />
        </div>
      </TabsContent>

      <TabsContent value="email" className="mt-0">
        <div className="bg-gray-50 p-4 rounded-md min-h-[200px]">
          <TemplateContent 
            isLoading={isEmailLoading}
            content={emailTemplate}
            type="email"
            onCopy={onCopy}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
