import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, FileText, Calculator, LogOut, Plus } from "lucide-react";

export default function Account() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b">
        <div className="container-width py-4">
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
      <main className="container-width py-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Your Property Hub
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This is your central dashboard where you'll manage your properties,
            track home improvement projects, and calculate tax deductions.
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 text-center">
          <div className="max-w-md mx-auto">
            <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Properties Added Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by adding your first property. You can add multiple
              properties and manage their projects and tax calculations
              individually.
            </p>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </div>
        </div>

        {/* Three Key Sections */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Properties Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Home className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Properties</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Add and manage multiple properties. Each property will have its own
              projects and tax calculations.
            </p>
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Projects</h3>
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
            <p className="text-gray-600 text-sm">
              Get automated tax calculations based on your property improvements and
              expenses.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}