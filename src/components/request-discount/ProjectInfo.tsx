
import { Project } from "@/hooks/useProjects";

interface ProjectInfoProps {
  project: Project;
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <>
      <h2 className="text-lg font-medium mb-4">
        Project: {project.name}
      </h2>
      <p className="text-gray-600 mb-4">
        Based on our analysis, your {project.name} project may qualify for an insurance premium discount. Use the templates below to contact your insurance provider.
      </p>
    </>
  );
}
