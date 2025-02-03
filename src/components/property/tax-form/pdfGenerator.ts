import jsPDF from 'jspdf'
import type { TaxFormData } from './types'

export function generatePDF(formType: string, formData: TaxFormData) {
  const doc = new jsPDF()
  const margin = 20
  let yPosition = margin

  // Add header
  doc.setFontSize(16)
  doc.text(`IRS Form ${formType}`, margin, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.text(`Tax Year: ${formData.taxYear}`, margin, yPosition)
  yPosition += 10

  // Property Information
  doc.setFontSize(14)
  doc.text("Property Information", margin, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.text(`Address: ${formData.propertyInfo.address}`, margin, yPosition)
  yPosition += 7
  doc.text(`Purchase Price: $${formData.propertyInfo.purchasePrice.toLocaleString()}`, margin, yPosition)
  yPosition += 7
  doc.text(`Purchase Date: ${new Date(formData.propertyInfo.purchaseDate).toLocaleDateString()}`, margin, yPosition)
  yPosition += 7
  doc.text(`Current Value: $${formData.propertyInfo.currentValue.toLocaleString()}`, margin, yPosition)
  yPosition += 15

  // Improvements
  doc.setFontSize(14)
  doc.text("Property Improvements", margin, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  formData.improvements.forEach((improvement) => {
    doc.text(`Project: ${improvement.name}`, margin, yPosition)
    yPosition += 7
    doc.text(`Cost: $${improvement.cost.toLocaleString()}`, margin + 10, yPosition)
    yPosition += 7
    doc.text(`Date: ${new Date(improvement.date).toLocaleDateString()}`, margin + 10, yPosition)
    yPosition += 10
  })

  // Calculate totals
  const totalImprovements = formData.improvements.reduce((sum, imp) => sum + imp.cost, 0)
  yPosition += 5
  doc.text(`Total Improvements: $${totalImprovements.toLocaleString()}`, margin, yPosition)
  yPosition += 7
  doc.text(`Adjusted Cost Basis: $${(formData.propertyInfo.purchasePrice + totalImprovements).toLocaleString()}`, margin, yPosition)

  // Save the PDF
  doc.save(`tax-form-${formType}-${formData.taxYear}.pdf`)
}