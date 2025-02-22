
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PropertyFormHeader } from "@/components/property/PropertyFormHeader"
import { PropertyFormActions } from "@/components/property/PropertyFormActions"
import { Property } from "@/hooks/useProperties"

const formSchema = z.object({
  propertyType: z.enum(["PRIMARY_HOME", "SECOND_HOME", "RENTAL"]),
  name: z.string().min(2, {
    message: "Property name must be at least 2 characters.",
  }),
  streetAddress: z.string().min(2, {
    message: "Street address must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
  purchasePrice: z.string().min(1, {
    message: "Purchase price is required.",
  }),
  purchaseDate: z.date(),
  currentValue: z.string().min(1, {
    message: "Current value is required.",
  }),
  livedInProperty2of5Years: z.boolean().default(true).optional(),
})

export type PropertyFormValues = z.infer<typeof formSchema>

interface PropertyFormProps {
  property?: Property
  propertyId?: string
  onCancel: () => void
  onSuccess: () => void
}

export function PropertyForm({ property, propertyId, onCancel, onSuccess }: PropertyFormProps) {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: property?.property_type || "PRIMARY_HOME",
      name: property?.name || "",
      streetAddress: property?.street_address || "",
      city: property?.city || "",
      state: property?.state || "",
      zipCode: property?.zip_code || "",
      purchasePrice: property?.purchase_price?.toString() || "",
      purchaseDate: property?.purchase_date ? new Date(property.purchase_date) : new Date(),
      currentValue: property?.current_value?.toString() || "",
      livedInProperty2of5Years: property?.lived_in_property_2_of_5_years ?? true,
    },
  })

  function onSubmit(values: PropertyFormValues) {
    onSuccess()
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="max-w-2xl mx-auto px-4">
          <PropertyFormHeader 
            isEditing={!!property}
          />
          
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PRIMARY_HOME">Primary Home</SelectItem>
                    <SelectItem value="SECOND_HOME">Second Home</SelectItem>
                    <SelectItem value="RENTAL">Rental</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  This is the type of property you are adding.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Main House" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of the property.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormDescription>
                  This is the street address of the property.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" {...field} />
                </FormControl>
                <FormDescription>
                  This is the city of the property.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="NY" {...field} />
                </FormControl>
                <FormDescription>
                  This is the state of the property.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="10001" {...field} />
                </FormControl>
                <FormDescription>
                  This is the zip code of the property.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price</FormLabel>
                <FormControl>
                  <Input placeholder="$100,000" {...field} />
                </FormControl>
                <FormDescription>
                  This is the price you paid for the property.
                </FormDescription>
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
                          "w-[240px] pl-3 text-left font-normal",
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
                <FormDescription>
                  This is the date you purchased the property.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Value</FormLabel>
                <FormControl>
                  <Input placeholder="$150,000" {...field} />
                </FormControl>
                <FormDescription>
                  This is the current value of the property.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="livedInProperty2of5Years"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Lived in property 2 of 5 years</FormLabel>
                  <FormDescription>
                    Have you lived in this property for at least 2 of the last 5
                    years?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <PropertyFormActions 
            isEditing={!!property}
            propertyId={propertyId}
            onCancel={onCancel}
          />
        </div>
      </form>
    </Form>
  )
}
