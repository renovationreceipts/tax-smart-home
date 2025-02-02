import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoneyField } from "@/components/property/MoneyField"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  cost: z.string().min(1, "Project cost is required"),
  completion_date: z.date({
    required_error: "Completion date is required",
  }),
  builder_name: z.string().optional(),
  builder_url: z.string().url().optional().or(z.literal("")),
  beforePhotos: z.instanceof(FileList).optional(),
  afterPhotos: z.instanceof(FileList).optional(),
  receipts: z.instanceof(FileList).optional(),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  propertyId: string
  onSuccess: () => void
  onCancel: () => void
}

export function ProjectForm({ propertyId, onSuccess, onCancel }: ProjectFormProps) {
  const { toast } = useToast()
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      cost: "",
      completion_date: new Date(),
      builder_name: "",
      builder_url: "",
    },
  })

  const handleFileUpload = async (files: FileList, category: string, projectId: string) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const filePath = `${projectId}/${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        continue
      }

      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_path: filePath,
          file_type: file.type,
          file_category: category,
        })

      if (dbError) {
        console.error('Error saving file metadata:', dbError)
      }
    }
  }

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
        })
        .select()
        .single()

      if (error) throw error

      // Upload files if they exist
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

      toast({
        title: "Success",
        description: "Project has been added successfully.",
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

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold">Add New Project</h2>
        <p className="text-muted-foreground">
          Enter your project details below.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Kitchen Renovation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your project..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <MoneyField
            form={form}
            name="cost"
            label="Project Cost"
          />

          <FormField
            control={form.control}
            name="completion_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Completion Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="beforePhotos"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Before Photos (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files
                      if (files) {
                        onChange(files)
                      }
                    }}
                    {...field}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="afterPhotos"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>After Photos (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files
                      if (files) {
                        onChange(files)
                      }
                    }}
                    {...field}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receipts"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Receipts (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files
                      if (files) {
                        onChange(files)
                      }
                    }}
                    {...field}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="builder_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Builder Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Builder or Contractor Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="builder_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Builder Website (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Add Project
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
