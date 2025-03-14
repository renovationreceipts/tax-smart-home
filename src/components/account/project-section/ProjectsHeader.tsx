
import { FileText, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Property } from "@/hooks/useProperties";

interface ProjectsHeaderProps {
  selectedProperty: Property | undefined;
  properties: Property[];
  hasProjects: boolean;
  onAddProject: () => void;
  onPropertySelect: (propertyId: string) => void;
  onAddProperty: () => void;
}

export function ProjectsHeader({
  selectedProperty,
  properties,
  hasProjects,
  onAddProject,
  onPropertySelect,
  onAddProperty
}: ProjectsHeaderProps) {
  return (
    <>
      <div className="hidden sm:flex items-center justify-between">
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
              {properties.map(property => (
                <DropdownMenuItem key={property.id} onClick={() => onPropertySelect(property.id)}>
                  {property.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem className="text-[#0090FF] border-t" onClick={onAddProperty}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {hasProjects && (
          <Button 
            onClick={onAddProject} 
            size="sm" 
            variant="ghost" 
            className="border bg-white text-[#0090FF] border-[#0090FF] hover:bg-blue-50 hover:text-[#0090FF] hover:border-[#0090FF]"
          >
            <Plus className="h-4 w-4 mr-2 text-[#0090FF]" />
            Add Project
          </Button>
        )}
      </div>

      <div className="sm:hidden space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#0090FF]" />
            <h3 className="font-semibold text-2xl">Projects</h3>
          </div>
          {hasProjects && (
            <Button 
              onClick={onAddProject} 
              size="sm" 
              variant="ghost" 
              className="border bg-white text-[#0090FF] border-[#0090FF] hover:bg-blue-50 hover:text-[#0090FF] hover:border-[#0090FF]"
            >
              <Plus className="h-4 w-4 mr-2 text-[#0090FF]" />
              Add
            </Button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedProperty?.name || "Select Property"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {properties.map(property => (
              <DropdownMenuItem key={property.id} onClick={() => onPropertySelect(property.id)}>
                {property.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem className="text-[#0090FF] border-t" onClick={onAddProperty}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Property
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
