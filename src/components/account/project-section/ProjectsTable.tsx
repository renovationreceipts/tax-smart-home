
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Project } from "@/hooks/useProjects";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface ProjectsTableProps {
  projects: Project[];
  totalProjectCosts: number;
  onViewProject: (project: Project) => void;
}

export function ProjectsTable({ projects, totalProjectCosts, onViewProject }: ProjectsTableProps) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-base">Project Name</TableHead>
            <TableHead className="text-right text-base">Cost</TableHead>
            <TableHead className="text-right text-base">Completion Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => (
            <TableRow 
              key={project.id} 
              onClick={() => onViewProject(project)} 
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="font-medium text-base">{project.name}</TableCell>
              <TableCell className="text-right text-base">{formatCurrency(project.cost)}</TableCell>
              <TableCell className="text-right text-base">{formatDate(project.completion_date)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="border-t">
            <TableCell className="font-semibold text-base">Total Projects Cost</TableCell>
            <TableCell className="text-right font-semibold text-base">{formatCurrency(totalProjectCosts)}</TableCell>
            <TableCell className="text-right" />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
