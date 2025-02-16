
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TaxCalculationTable } from "@/components/property/TaxCalculationTable"
import { AIAnalysisCard } from "./AIAnalysisCard"
import { ProjectAnalysisModal } from "../project/ProjectAnalysisModal"
import { useState } from "react"
import type { Project } from "@/hooks/useProjects"
import type { Property } from "@/hooks/useProperties"

interface TaxAnalysisTabsProps {
  projectedTaxSavings: number
  projects: Project[]
  selectedProperty: Property | undefined
}

export function TaxEducationalContent() {
  return (
    <div className="bg-white rounded-xl border p-6 my-6">
      <h2 className="text-xl font-semibold mb-6">Understanding Tax Savings</h2>
      <p className="text-gray-600 mb-6">
        When you sell your home, your taxable gain is calculated using this formula:
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
        <p className="font-medium text-lg">Taxable Gain = Sale Price - Cost Basis</p>
        <p className="text-sm text-gray-500 mt-2">Your cost basis includes purchase price + qualifying improvements</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Example Scenario</th>
              <th className="text-left py-2">Without Tracking</th>
              <th className="text-left py-2">With Renovation Receipts</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">Purchase Price</td>
              <td>$650,000</td>
              <td>$650,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">Home Improvements</td>
              <td>Unknown 🤷</td>
              <td>$100,000 (Tracked) ✅</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">Sale Price</td>
              <td>$1,000,000</td>
              <td>$1,000,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">Cost Basis</td>
              <td>$650,000</td>
              <td>$750,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">Taxable Gain</td>
              <td>$350,000</td>
              <td>$250,000</td>
            </tr>
            <tr>
              <td className="py-3">Federal Tax Owed (15%)</td>
              <td>$15,000</td>
              <td>$0 (Fully Exempt) 🎉</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-primary font-semibold flex items-center justify-center gap-2">
        <span>💰</span>
        By tracking home improvements, this homeowner saved $15,000 in taxes!
      </p>
    </div>
  )
}

export function TaxAnalysisTabs({ projectedTaxSavings, projects, selectedProperty }: TaxAnalysisTabsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <Tabs defaultValue="tax-savings" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 h-auto bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="tax-savings" 
            className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
          >
            <div className="text-center">
              <h3 className="font-semibold">Future Tax Savings</h3>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="tax-credits" 
            className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
          >
            <div className="text-center">
              <h3 className="font-semibold">Tax Credits</h3>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="insurance" 
            className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
          >
            <div className="text-center">
              <h3 className="font-semibold">Insurance Savings</h3>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tax-savings" className="mt-6 space-y-6">
          <AIAnalysisCard 
            projectedTaxSavings={projectedTaxSavings}
            projects={projects}
            onProjectClick={setSelectedProject}
          />

          <TaxEducationalContent />

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-6">Detailed Tax Calculation</h2>
            {selectedProperty ? (
              <TaxCalculationTable 
                property={selectedProperty}
                projects={projects}
                onProjectClick={setSelectedProject}
              />
            ) : (
              <p className="text-gray-500">No property selected. Please add a property to view tax calculations.</p>
            )}
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

      <ProjectAnalysisModal
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  )
}
