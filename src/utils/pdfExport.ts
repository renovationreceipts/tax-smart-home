
import { jsPDF } from "jspdf"
import type { Project } from "@/hooks/useProjects"
import type { ProjectFile } from "@/components/project/form/file-fields/types"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"

export const generateProjectsPDF = (projects: Project[], projectFiles: { [key: string]: ProjectFile[] }) => {
  const doc = new jsPDF()
  let yPos = 20
  const margin = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Title
  doc.setFontSize(20)
  doc.text("Projects Report", margin, yPos)
  yPos += 15

  projects.forEach((project, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    // Project Header
    doc.setFontSize(16)
    doc.text(project.name, margin, yPos)
    yPos += 10

    // Project Cost
    doc.setFontSize(12)
    doc.text(`Cost: ${formatCurrency(project.cost)}`, margin, yPos)
    yPos += 7

    // Completion Date
    doc.text(`Completion Date: ${format(new Date(project.completion_date), "MMMM d, yyyy")}`, margin, yPos)
    yPos += 7

    // Builder Information
    if (project.builder_name) {
      doc.text(`Builder: ${project.builder_name}`, margin, yPos)
      yPos += 7
    }
    if (project.builder_url) {
      doc.text(`Builder Website: ${project.builder_url}`, margin, yPos)
      yPos += 7
    }

    // Description
    if (project.description) {
      doc.text("Description:", margin, yPos)
      yPos += 7
      const splitDescription = doc.splitTextToSize(project.description, pageWidth - (2 * margin))
      doc.text(splitDescription, margin, yPos)
      yPos += (splitDescription.length * 7)
    }

    // Files Section
    const files = projectFiles[project.id] || []
    if (files.length > 0) {
      yPos += 5
      doc.text("Attached Files:", margin, yPos)
      yPos += 7

      const fileCategories = {
        before_photo: "Before Photos",
        after_photo: "After Photos",
        receipt: "Receipts"
      }

      Object.entries(fileCategories).forEach(([category, title]) => {
        const categoryFiles = files.filter(f => f.file_category === category)
        if (categoryFiles.length > 0) {
          doc.text(`${title}:`, margin + 5, yPos)
          yPos += 7
          categoryFiles.forEach(file => {
            const fileName = typeof file.file_path === "string" 
              ? file.file_path.split("/").pop() 
              : file.file_path.name
            doc.text(`• ${fileName}`, margin + 10, yPos)
            yPos += 7
          })
        }
      })
    }

    // Add spacing between projects
    yPos += 10

    // Add page break if not last project
    if (index < projects.length - 1 && yPos > 200) {
      doc.addPage()
      yPos = 20
    }
  })

  return doc
}
