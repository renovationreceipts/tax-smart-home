
import { FileText, Plus, Wrench, ClipboardList, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/hooks/useProjects";
import { useProperties } from "@/hooks/useProperties";
import { ProjectTypeExamples } from "@/components/project/ProjectTypeExamples";
import { useNavigate } from "react-router-dom";

interface ProjectsSectionProps {
  propertyId: string | null;
  projects: Project[];
  onAddProject: () => void;
  onEditProject?: (project: Project) => void;
}

export function ProjectsSection({
  propertyId,
  projects,
  onAddProject,
  onEditProject
}: ProjectsSectionProps) {
  const navigate = useNavigate();
  const {
    data: properties = []
  } = useProperties();

  const selectedProperty = properties.find(p => p.id === propertyId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!propertyId || properties.length === 0) {
    return null;
  }

  const EmptyState = () => <div className="space-y-8">
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Wrench className="h-5 w-5 text-[#0090FF]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Step 2: Add your home projects</h3>
              <p className="text-sm text-gray-600 mt-1">
                Store photos, receipts and document your projects for safekeeping.
              </p>
            </div>
          </div>
          <div className="hidden sm:block">
            <Button onClick={onAddProject} className="border border-primary text-white hover:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden sm:block">
        <ProjectTypeExamples />
      </div>

      <div className="sm:hidden">
        <Button onClick={onAddProject} className="w-full border border-primary text-white hover:text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>
    </div>;

  const MobileProjectCard = ({
    project
  }: {
    project: Project;
  }) => <div className="border-b last:border-b-0 py-6 first:pt-2 last:pb-2 px-4 space-y-4" onClick={() => onEditProject?.(project)}>
      <h3 className="text-xl font-bold">{project.name}</h3>
      <div className="space-y-1 text-base">
        <div className="flex justify-between">
          <span className="text-gray-600">Project Cost:</span>
          <span className="font-medium">{formatCurrency(project.cost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Completion Date:</span>
          <span className="font-medium">{formatDate(project.completion_date)}</span>
        </div>
      </div>
      <Button variant="outline" className="w-full text-primary hover:text-primary" onClick={e => {
      e.stopPropagation();
      onEditProject?.(project);
    }}>
        View Project
      </Button>
    </div>;

  return <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="pb-4 sm:pb-0 border-b sm:border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#0090FF]" />
            <h3 className="font-semibold text-2xl">Projects</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  {selectedProperty?.name || "Select Property"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                {properties.map((property) => (
                  <DropdownMenuItem
                    key={property.id}
                    onClick={() => navigate(`/account?propertyId=${property.id}`)}
                  >
                    {property.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  className="text-[#0090FF] border-t"
                  onClick={() => navigate("/property/edit")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Property
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {projects.length > 0 && <Button onClick={onAddProject} size="sm" variant="ghost" className="border bg-white text-[#0090FF] border-[#0090FF] hover:bg-white/90 hover:text-[#0090FF] hover:border-[#0090FF]">
              <Plus className="h-4 w-4 mr-2 text-[#0090FF]" />
              <span className="hidden sm:inline">Add Project</span>
              <span className="sm:hidden">Add</span>
            </Button>}
        </div>
      </div>

      {projects.length === 0 ? <div className="mt-4">
          <EmptyState />
        </div> : <div className="mt-4">
          <div className="block sm:hidden -mx-6">
            {projects.map(project => <MobileProjectCard key={project.id} project={project} />)}
          </div>
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
                {projects.map(project => <TableRow key={project.id} onClick={() => onEditProject?.(project)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium text-base">{project.name}</TableCell>
                    <TableCell className="text-right text-base">{formatCurrency(project.cost)}</TableCell>
                    <TableCell className="text-right text-base">{formatDate(project.completion_date)}</TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>
          <div className="border-t mt-6 pt-6">
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 mt-1 text-gray-600" />
              <h3 className="font-medium text-base">You're making a smart choice! All your records are encrypted and securely stored.</h3>
            </div>
          </div>
        </div>}
    </div>;
}
