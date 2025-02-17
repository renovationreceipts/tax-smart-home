import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable";
import { AIAnalysisCard } from "./AIAnalysisCard";
import { ProjectAnalysisModal } from "../project/ProjectAnalysisModal";
import { useState } from "react";
import type { Project } from "@/hooks/useProjects";
import type { Property } from "@/hooks/useProperties";
interface TaxAnalysisTabsProps {
  projectedTaxSavings: number;
  projects: Project[];
  selectedProperty: Property | undefined;
}
export function TaxAnalysisTabs({
  projectedTaxSavings,
  projects,
  selectedProperty
}: TaxAnalysisTabsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  return <>
      <Tabs defaultValue="tax-savings" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 h-auto bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="tax-savings" className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all rounded-md">
            <div className="text-center">
              <h3 className="font-semibold">Future Tax Savings</h3>
            </div>
          </TabsTrigger>
          <TabsTrigger value="tax-credits" className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all rounded-md">
            <div className="text-center">
              <h3 className="font-semibold">Tax Credits</h3>
            </div>
          </TabsTrigger>
          <TabsTrigger value="insurance" className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
            <div className="text-center">
              <h3 className="font-semibold">Insurance Savings</h3>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tax-savings" className="mt-6 space-y-6">
          <AIAnalysisCard projectedTaxSavings={projectedTaxSavings} projects={projects} onProjectClick={setSelectedProject} />

          <div className="bg-white rounded-xl border p-6">
            {selectedProperty ? <TaxCalculationTable property={selectedProperty} projects={projects} onProjectClick={setSelectedProject} /> : <p className="text-gray-500">No property selected. Please add a property to view tax calculations.</p>}
          </div>
        </TabsContent>

        <TabsContent value="tax-credits" className="mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Tax Credits</h2>
            <p className="text-gray-500">Coming soon! We're working on bringing you valuable tax credit opportunities.</p>
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Insurance Savings</h2>
            <p className="text-gray-500">Coming soon! We're working on bringing you insurance saving opportunities.</p>
          </div>
        </TabsContent>
      </Tabs>

      <ProjectAnalysisModal project={selectedProject} open={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </>;
}