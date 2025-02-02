interface ProjectFormHeaderProps {
  isEditing: boolean
}

export function ProjectFormHeader({ isEditing }: ProjectFormHeaderProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold">
        {isEditing ? "Edit Project" : "Add New Project"}
      </h2>
      <p className="text-sm text-gray-500">
        {isEditing 
          ? "Update the details of your existing project."
          : "Enter the details of your new project."
        }
      </p>
    </div>
  )
}