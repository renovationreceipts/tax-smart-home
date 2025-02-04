export interface ProjectFile {
  id: string
  file_path: string | File  // Updated to allow both string and File types
  file_type: string
  file_category: string
  size: number
}