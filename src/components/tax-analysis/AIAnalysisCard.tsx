
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Project } from "@/hooks/useProjects";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, InfoIcon, Check, X } from "lucide-react";
import { useTaxCalculations } from "@/hooks/useTaxCalculations";

interface AIAnalysisCardProps {
  projectedTaxSavings: number;
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

export function AIAnalysisCard({
  projectedTaxSavings,
  projects,
  onProjectClick
}: AIAnalysisCardProps) {
  const qualifyingProjects = projects.filter(p => p.qualifies_for_basis);
  const nonQualifyingProjects = projects.filter(p => !p.qualifies_for_basis);

  const { userTaxRate, totalProjectCosts, houseValueGrowthRate } = useTaxCalculations({ 
    property: projects[0]?.property_id ? { id: projects[0].property_id } : null, 
    projects 
  });

  const projectedTaxAmount = totalProjectCosts * (userTaxRate || 0.15); // Default to 15% if no user tax rate

  return <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">How Does This Save You Money</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg flex gap-3">
            <InfoIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-600">
                When you sell your home, you're taxed on the profit—the difference between your sale price and your cost basis. 
                Your cost basis includes what you originally paid for your home plus qualifying improvements you've made over time.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg flex gap-3">
            <InfoIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-800">
                By tracking {formatCurrency(totalProjectCosts)} in eligible improvements, you're increasing your cost basis by the same amount. 
                This reduces your taxable profit by {formatCurrency(totalProjectCosts)} when you sell.
              </p>
              
              <p className="text-gray-800 mt-2">
                At the {(userTaxRate * 100).toFixed(0)}% capital gains tax rate, this means you'll save {formatCurrency(projectedTaxAmount)} in taxes!
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg flex gap-3">
            <InfoIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Important Tax Threshold</h3>
              <p className="text-gray-600">
                If your taxable profit is over $250K (single) or $500K (married), tracking improvements reduces your taxable gain and saves you thousands.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">Does Every Project Count?</h2>
        <p className="text-gray-500 text-lg mb-8">Not Every Project Counts—But We've Got You Covered</p>

        <div className="space-y-6">
          <div className="flex gap-3">
            <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Qualifying Improvements</h3>
              <p className="text-gray-500">
                Improvements that add value, extend the home's life, or adapt it to new uses count.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <X className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Non-Qualifying Projects</h3>
              <p className="text-gray-500">
                Repairs and maintenance (like fixing a leaky faucet or repainting a room) don't count.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg flex gap-3">
            <InfoIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">How We Help</h3>
              <p className="text-gray-600">
                Our AI automatically analyzes your projects and tells you which ones qualify—so you don't have to guess. Below, you'll see the improvements that increase your cost basis (and save you money) and those that don't.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">AI Tax Analysis</h2>

        <Tabs defaultValue="qualifying" className="w-full">
          <TabsList className="flex h-auto space-x-6 bg-transparent mb-6 justify-start">
            <TabsTrigger value="qualifying" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:underline hover:text-primary/90 text-left">
              Projects That Qualify for Tax Basis ({qualifyingProjects.length})
            </TabsTrigger>
            <TabsTrigger value="non-qualifying" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:underline hover:text-primary/90 text-left">
              Projects that Don't Qualify ({nonQualifyingProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qualifying">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualifyingProjects.length === 0 ? <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No qualifying projects found
                    </TableCell>
                  </TableRow> : qualifyingProjects.map(project => <TableRow key={project.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onProjectClick?.(project)}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{new Date(project.completion_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{formatCurrency(project.cost)}</TableCell>
                    </TableRow>)}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="non-qualifying">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nonQualifyingProjects.length === 0 ? <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No non-qualifying projects found
                    </TableCell>
                  </TableRow> : nonQualifyingProjects.map(project => <TableRow key={project.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onProjectClick?.(project)}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{new Date(project.completion_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{formatCurrency(project.cost)}</TableCell>
                    </TableRow>)}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Based on our AI analysis, we've identified which of your home improvement projects qualify 
            for tax basis adjustment. Click on any project to see the detailed analysis.
          </p>
        </div>
      </Card>
    </div>;
}
