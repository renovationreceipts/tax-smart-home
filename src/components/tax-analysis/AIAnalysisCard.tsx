import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Project } from "@/hooks/useProjects";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, Receipt, Clock, Sparkles } from "lucide-react";
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
  return <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">AI Project Analysis</h2>

      <div className="mb-8 border rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold mb-2">Your Future Tax Savings Explained</h3>
            <p className="text-gray-600">
              Looking on your home projects, our AI has identified potential future tax savings through cost basis
              adjustments. If you ever sell your home, you'll pay tax only on the profit after subtracting your tracked
              improvements—potentially saving you thousands. The more you track, the more you save!
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-2xl font-bold">
              {formatCurrency(projectedTaxSavings)} <ArrowUpRight className="h-5 w-5" />
            </div>
            <div className="text-gray-500">Future Tax Savings</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <Receipt className="h-5 w-5 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium mb-1">Cost Basis Explained</h4>
              <p className="text-gray-600 text-sm">
                Your home's cost basis is your purchase price plus qualifying improvements. A higher cost basis means lower taxable profit when you sell.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium mb-1">What Qualifies</h4>
              <p className="text-gray-600 text-sm">
                Improvements that add value, prolong life, or adapt your home to new uses. Regular repairs don't count.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="h-5 w-5 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium mb-1">When You Save</h4>
              <p className="text-gray-600 text-sm">
                Savings apply when you sell your home. Track now to reduce taxes later!
              </p>
            </div>
          </div>
        </div>
      </div>

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
    </Card>;
}