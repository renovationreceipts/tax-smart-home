import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, FileText, Calculator, LogOut, Plus } from "lucide-react"
import { PropertyForm } from "@/components/PropertyForm"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Property {
  id: string
  name: string
  address: string
  purchase_price: number
  current_value: number
}

export default function Account() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [showPropertyForm, setShowPropertyForm] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("id, name, address, purchase_price, current_value")
      
      if (error) throw error
      
      setProperties(data || [])
    } catch (error) {
      console.error("Error fetching properties:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load properties.",
      })
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again.",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (showPropertyForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <PropertyForm onCancel={() => setShowPropertyForm(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6" />
              <span className="text-xl font-bold">HomeCostTracker</span>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Properties Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
            <Button onClick={() => setShowPropertyForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>

          {properties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Properties Added Yet
                </h3>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  Get started by adding your first property. You can add multiple
                  properties and manage their projects and tax calculations
                  individually.
                </p>
                <Button onClick={() => setShowPropertyForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Property
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Current Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell>{property.address}</TableCell>
                      <TableCell>{formatCurrency(property.purchase_price)}</TableCell>
                      <TableCell>{formatCurrency(property.current_value)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Two Key Sections */}
        <div className="space-y-6">
          {/* Projects Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Projects</h3>
              </div>
              <Button 
                onClick={() => toast({
                  title: "Not implemented yet",
                  description: "Project creation functionality is coming soon.",
                })}
                disabled={properties.length === 0}
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </div>
            <p className="text-gray-600 text-sm">
              Track home improvement projects for each property. These will be used
              for tax calculations.
            </p>
          </div>

          {/* Tax Calculation Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Tax Calculation</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Get automated tax calculations based on your property improvements and
              expenses.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Current Home Value</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Purchase Price</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Basis Adjustments</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">New Cost Basis</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Taxable Gain With New Cost Basis</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Taxable Gain Without New Cost Basis</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tracking Improvements Reduced Your Taxable Capital Gain By</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-green-600">Based on Your Tax Rate This Saved You</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}