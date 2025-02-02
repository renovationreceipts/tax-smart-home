interface PropertyFormHeaderProps {
  isEditing: boolean
}

export function PropertyFormHeader({ isEditing }: PropertyFormHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold">
        {isEditing ? "Edit Property" : "Add New Property"}
      </h2>
      <p className="text-muted-foreground">
        {isEditing ? "Update your property details below." : "Enter your property details below."}
      </p>
    </div>
  )
}