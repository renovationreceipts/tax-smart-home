import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  propertyType: z.enum(["PRIMARY_HOME", "SECOND_HOME", "RENTAL"], {
    required_error: "Please select a property type.",
  }),
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Property address is required"),
  purchasePrice: z.string().min(1, "Purchase price is required"),
  purchaseDate: z.date({
    required_error: "Purchase date is required.",
  }),
  currentValue: z.string().min(1, "Current property value is required"),
})

type PropertyFormValues = z.infer<typeof formSchema>

interface PropertyFormProps {
  onCancel: () => void;
}

export function PropertyForm({ onCancel }: PropertyFormProps) {
  const { toast } = useToast()

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      purchasePrice: "",
      currentValue: "",
    },
  })

  function formatCurrency(value: string) {
    const numericValue = value.replace(/[^0-9]/g, "")
    if (!numericValue) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(numericValue) / 100)
  }

  function onSubmit(data: PropertyFormValues) {
    console.log("Form submitted:", data)
    toast({
      title: "Property Added",
      description: "Your property has been successfully added.",
    })
    // TODO: Handle property creation in database
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold">Add New Property</h2>
        <p className="text-muted-foreground">Enter your property details below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PRIMARY_HOME">Primary Home</SelectItem>
                    <SelectItem value="SECOND_HOME">Second Home</SelectItem>
                    <SelectItem value="RENTAL">Rental Property</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Name/Description</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Beach House" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Purchase Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="$0.00"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value)
                      e.target.value = formatted
                      onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Purchase Date</FormLabel>
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
            name="currentValue"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Current Property Value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="$0.00"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value)
                      e.target.value = formatted
                      onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Property</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}