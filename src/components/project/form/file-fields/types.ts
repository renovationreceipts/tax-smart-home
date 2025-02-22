
export interface ProjectFile {
  id: string
  file_path: string | File
  file_type: string
  file_category: string
  size: number
  project_id: string
  publicUrl?: string
}
