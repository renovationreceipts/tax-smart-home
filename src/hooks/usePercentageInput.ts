import { useState, useRef, ChangeEvent } from "react"

export interface UsePercentageInputProps {
  /**
   * The current numeric value
   */
  value: number
  /**
   * Callback when the value changes
   */
  onChange: (value: number) => void
  /**
   * Maximum number of decimal places (default: 2)
   */
  maxDecimals?: number
}

export function usePercentageInput({ value, onChange, maxDecimals = 2 }: UsePercentageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [displayValue, setDisplayValue] = useState<string>(value ? `${value}%` : "")
  
  // Track cursor position to restore it after formatting
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const rawValue = input.value
    const cursorPosition = input.selectionStart
    
    // Remember if cursor was at the end before formatting
    const wasAtEnd = cursorPosition === rawValue.length
    
    // Calculate cursor position relative to number part (ignoring %)
    const numericPart = rawValue.replace(/%/g, "")
    const relativePosition = wasAtEnd ? numericPart.length : cursorPosition
    
    // Case 1: Empty input (allow clearing the field)
    if (rawValue === "" || rawValue === "%") {
      setDisplayValue("")
      onChange(0)
      return
    }
    
    // Store original string for comparison
    const originalString = rawValue
    
    // Remove % symbol for processing
    let processed = rawValue.replace(/%/g, "")
    
    // Only allow one decimal point
    const parts = processed.split(".")
    if (parts.length > 2) {
      processed = parts[0] + "." + parts.slice(1).join("")
    }
    
    // Remove any non-numeric characters except decimal point
    processed = processed.replace(/[^0-9.]/g, "")
    
    // Handle special case when it's just a decimal point
    if (processed === ".") {
      setDisplayValue("0.%")
      setTimeout(() => {
        // Position cursor after the decimal point
        input.setSelectionRange(2, 2)
      }, 0)
      return
    }
    
    // Handle backspace at the end (before %)
    if (
      originalString.endsWith("%") && 
      cursorPosition === originalString.length - 1 &&
      originalString.length < displayValue.length
    ) {
      // User is trying to delete the last digit (before %)
      processed = processed.slice(0, -1)
    }
    
    // Handle formatting and cursor position
    let formatted: string
    let newPosition: number
    
    // Check if we have a valid number
    const isValidNumber = processed.length > 0 && processed !== "."
    
    if (isValidNumber) {
      // Format with decimal places
      if (processed.includes(".")) {
        const [whole, decimal = ""] = processed.split(".")
        // Limit decimal places
        const trimmedDecimal = decimal.slice(0, maxDecimals)
        formatted = `${whole}.${trimmedDecimal}%`
        
        // Calculate new cursor position
        if (wasAtEnd || cursorPosition > rawValue.length - 1) {
          // If cursor was at the end, keep it at the end
          newPosition = formatted.length - 1
        } else {
          // Keep cursor at the same relative position
          newPosition = Math.min(relativePosition, formatted.length - 1)
        }
      } else {
        // No decimal part
        formatted = `${processed}%`
        
        // Calculate new cursor position
        if (wasAtEnd || cursorPosition >= rawValue.length - 1) {
          // If cursor was at the end, keep it at the end (before %)
          newPosition = formatted.length - 1
        } else {
          // Keep cursor at the same relative position
          newPosition = Math.min(relativePosition, formatted.length - 1)
        }
      }
      
      // Extract numeric value for the onChange callback
      const numValue = parseFloat(processed)
      // Update state only if it's a valid number
      if (!isNaN(numValue)) {
        onChange(numValue)
      }
    } else {
      // Invalid or empty input
      formatted = ""
      newPosition = 0
      onChange(0)
    }
    
    // Update the displayed value
    setDisplayValue(formatted)
    
    // Restore cursor position after React updates the DOM
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newPosition, newPosition)
      }
    }, 0)
  }
  
  return {
    inputRef,
    displayValue,
    handleChange
  }
}
