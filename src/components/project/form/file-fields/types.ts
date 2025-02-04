export interface ProjectFile {
  id: string
  file_path: string | File
  file_type: string
  file_category: string
  size: number
  publicUrl?: string
}