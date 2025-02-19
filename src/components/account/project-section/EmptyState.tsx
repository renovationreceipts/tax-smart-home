
import { Wrench, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectTypeExamples } from "@/components/project/ProjectTypeExamples";

interface EmptyStateProps {
  onAddProject: () => void;
}

export function EmptyState({ onAddProject }: EmptyStateProps) {
  return (
    <div className="space-y-8">
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
    </div>
  );
}
