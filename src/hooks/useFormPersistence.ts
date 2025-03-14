
import { useEffect, useRef } from 'react'
import { UseFormReturn, FieldValues } from 'react-hook-form'

/**
 * Hook to persist form data to localStorage as the user types
 * @param form The react-hook-form instance
 * @param storageKey A unique key for localStorage
 * @param shouldPersist Whether to persist the form (enables conditional persistence)
 * @param excludeFields Fields to exclude from persistence (e.g., file inputs)
 */
export function useFormPersistence<T extends FieldValues>(
  form: UseFormReturn<T>,
  storageKey: string,
  shouldPersist: boolean = true,
  excludeFields: string[] = []
) {
  const initialized = useRef(false)

  // Load saved data on mount
  useEffect(() => {
    if (!shouldPersist || initialized.current) return
    
    try {
      const savedData = localStorage.getItem(storageKey)
      
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        
        // Filter out excluded fields and FileList objects that can't be serialized
        const formValues = Object.entries(parsedData).reduce((acc, [key, value]) => {
          // Skip excluded fields or fields with null/undefined values
          if (excludeFields.includes(key) || value === null || value === undefined) {
            return acc
          }
          
          // Handle date objects
          if (key === 'completion_date' && value) {
            acc[key] = new Date(value)
          } else {
            acc[key] = value
          }
          
          return acc
        }, {} as Record<string, any>)
        
        // Only set values if we have data
        if (Object.keys(formValues).length > 0) {
          form.reset(formValues as any)
        }
      }
    } catch (error) {
      console.error('Error loading saved form data:', error)
      // Silently fail and continue without saved data
    }
    
    initialized.current = true
  }, [form, storageKey, shouldPersist])

  // Save data when form values change
  useEffect(() => {
    if (!shouldPersist) return
    
    const subscription = form.watch((formValues) => {
      if (!formValues || Object.keys(formValues).length === 0) return
      
      try {
        // Filter out file inputs and excluded fields before saving
        const dataToSave = Object.entries(formValues).reduce((acc, [key, value]) => {
          // Skip file inputs and excluded fields
          if (
            excludeFields.includes(key) || 
            value instanceof FileList || 
            value === undefined
          ) {
            return acc
          }
          
          acc[key] = value
          return acc
        }, {} as Record<string, any>)
        
        localStorage.setItem(storageKey, JSON.stringify(dataToSave))
      } catch (error) {
        console.error('Error saving form data:', error)
        // Silently fail and continue without saving
      }
    })
    
    return () => subscription.unsubscribe()
  }, [form, storageKey, shouldPersist])

  // Function to clear saved form data
  const clearPersistedData = () => {
    if (!shouldPersist) return
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error('Error clearing form data:', error)
    }
  }

  return { clearPersistedData }
}
