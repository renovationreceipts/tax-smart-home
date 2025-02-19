
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useProperties } from "@/hooks/useProperties";
import { useProjects } from "@/hooks/useProjects";
import { AccountHeader } from "@/components/account/AccountHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TaxAnalysisTabs } from "@/components/tax-analysis/TaxAnalysisTabs";

export default function TaxAnalysis() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: properties = [] } = useProperties();
  const selectedProperty = properties[0]; // For now, we'll show the first property
  const { data: projects = [] } = useProjects(selectedProperty?.id);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AccountHeader onSignOut={handleSignOut} />
      
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 mb-6"
            onClick={() => navigate("/account")}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Button>

          <div className="bg-white rounded-xl">
            <TaxAnalysisTabs 
              projectedTaxSavings={0}
              projects={projects}
              selectedProperty={selectedProperty}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
