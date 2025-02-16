
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Project } from "@/hooks/useProjects";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight } from "lucide-react";

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
      <img 
        src="/lovable-uploads/95b45829-e994-47e6-9606-b66eaff22992.png"
        alt="Tax savings explanation"
        className="w-full rounded-lg mb-8"
      />

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
    </Card>;
}
