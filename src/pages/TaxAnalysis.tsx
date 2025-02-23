
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useProperties } from "@/hooks/useProperties";
import { useProjects } from "@/hooks/useProjects";
import { AccountHeader } from "@/components/account/AccountHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TaxAnalysisTabs } from "@/components/tax-analysis/TaxAnalysisTabs";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function TaxAnalysis() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const { data: properties = [], isLoading: propertiesLoading } = useProperties();
  const selectedProperty = propertyId ? properties.find(p => p.id === propertyId) : properties[0];
  const { data: projects = [] } = useProjects(selectedProperty?.id);

  useEffect(() => {
    // Only make navigation decisions if properties have finished loading
    if (!propertiesLoading) {
      // If no property is selected and we have properties, redirect to the first one
      if (!propertyId && properties.length > 0) {
        navigate(`/tax-analysis?propertyId=${properties[0].id}`, { replace: true });
      }
      // Only redirect to account if we're certain there are no properties after loading
      if (properties.length === 0) {
        navigate('/account');
        toast({
          title: "No properties found",
          description: "Please add a property first.",
          variant: "destructive"
        });
      }
    }
  }, [propertyId, properties, propertiesLoading, navigate, toast]);

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

  // Show loading state while properties are being fetched
  if (propertiesLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AccountHeader onSignOut={handleSignOut} />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  // If no property is selected or found after loading, show a message
  if (!selectedProperty) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AccountHeader onSignOut={handleSignOut} />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">No property selected</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AccountHeader onSignOut={handleSignOut} />
      
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 mb-6"
            onClick={() => navigate(`/account?propertyId=${selectedProperty.id}`)}
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
