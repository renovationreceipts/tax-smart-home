
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import type { ProjectFormValues } from "@/components/project/form/ProjectFormTypes"
import type { Project } from "@/hooks/useProjects"

interface UseProjectSubmitProps {
  propertyId: string
  project?: Project | null
  onSuccess: () => void
}

export function useProjectSubmit({ propertyId, project, onSuccess }: UseProjectSubmitProps) {
  const { toast } = useToast()

  const handleFileUpload = async (files: FileList, category: string, projectId: string) => {
    console.log(`Uploading ${files.length} files for category: ${category}`)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("User must be logged in to upload files")
    }
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      })

      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const filePath = `${projectId}/${crypto.randomUUID()}.${fileExt}`

      console.log(`Preparing to upload file: ${file.name} to path: ${filePath}`)
      
      let contentType = file.type
      if (fileExt === 'ico') {
        contentType = 'image/x-icon'
      }
      
      console.log('Using content type:', contentType)

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file, {
          upsert: false,
          contentType: contentType
        })

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        toast({
          variant: "destructive",
          title: "Upload Error",
          description: `Failed to upload ${file.name}: ${uploadError.message}`,
        })
        continue
      }

      console.log('File uploaded successfully, saving metadata to database')

      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          user_id: user.id,
          file_path: filePath,
          file_type: contentType,
          file_category: category,
        })

      if (dbError) {
        console.error('Error saving file metadata:', dbError)
        toast({
          variant: "destructive",
          title: "Database Error",
          description: `Failed to save metadata for ${file.name}: ${dbError.message}`,
        })
      }
    }
  }

  const analyzeProject = async (description: string): Promise<{ qualifies: boolean; analysis: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-project', {
        body: { description }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error analyzing project:', error);
      return { qualifies: false, analysis: 'Analysis failed' };
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to add a project.",
        })
        return
      }

      const numericCost = Number(data.cost.replace(/[^0-9.-]/g, ""))
      
      // Analyze the project description
      const { qualifies, analysis } = await analyzeProject(data.description || data.name);
      
      if (project) {
        const { error } = await supabase
          .from("projects")
          .update({
            name: data.name,
            description: data.description || null,
            cost: numericCost,
            completion_date: format(data.completion_date, "yyyy-MM-dd"),
            builder_name: data.builder_name || null,
            builder_url: data.builder_url || null,
            qualifies_for_basis: qualifies,
            ai_analysis_result: analysis
          })
          .eq('id', project.id)

        if (error) throw error

        const uploadPromises = []
        if (data.beforePhotos?.length) {
          uploadPromises.push(handleFileUpload(data.beforePhotos, 'before_photo', project.id))
        }
        if (data.afterPhotos?.length) {
          uploadPromises.push(handleFileUpload(data.afterPhotos, 'after_photo', project.id))
        }
        if (data.receipts?.length) {
          uploadPromises.push(handleFileUpload(data.receipts, 'receipt', project.id))
        }

        await Promise.all(uploadPromises)
      } else {
        const { data: projectData, error } = await supabase
          .from("projects")
          .insert({
            property_id: propertyId,
            user_id: user.id,
            name: data.name,
            description: data.description || null,
            cost: numericCost,
            completion_date: format(data.completion_date, "yyyy-MM-dd"),
            builder_name: data.builder_name || null,
            builder_url: data.builder_url || null,
            qualifies_for_basis: qualifies,
            ai_analysis_result: analysis
          })
          .select()
          .single()

        if (error) throw error

        const uploadPromises = []
        if (data.beforePhotos?.length) {
          uploadPromises.push(handleFileUpload(data.beforePhotos, 'before_photo', projectData.id))
        }
        if (data.afterPhotos?.length) {
          uploadPromises.push(handleFileUpload(data.afterPhotos, 'after_photo', projectData.id))
        }
        if (data.receipts?.length) {
          uploadPromises.push(handleFileUpload(data.receipts, 'receipt', projectData.id))
        }

        await Promise.all(uploadPromises)
      }

      toast({
        title: "Success",
        description: `Project has been ${project ? 'updated' : 'added'} successfully.`,
      })
      
      onSuccess()
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save project. Please try again.",
      })
    }
  }

  return { onSubmit }
}
