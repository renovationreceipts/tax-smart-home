
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProjectAndTaxSection } from "@/components/account/ProjectAndTaxSection";
import { AccountHeader } from "@/components/account/AccountHeader";
import { EmptyPropertyState } from "@/components/property/EmptyPropertyState";
import { WhySaveRecords } from "@/components/account/WhySaveRecords";
import { TotalSavingsCard } from "@/components/account/TotalSavingsCard";
import { PremiumCard } from "@/components/account/PremiumCard";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useProperties } from "@/hooks/useProperties";
import { useProjects } from "@/hooks/useProjects";

export default function Account() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [userTaxRate, setUserTaxRate] = useState(0);
  const { data: properties = [] } = useProperties();
  const { data: projects = [] } = useProjects(selectedPropertyId);
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  useEffect(() => {
    if (properties.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);

  useEffect(() => {
    const fetchUserTaxRate = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('tax_rate')
        .eq('id', user.id)
        .single();
      if (profile) {
        setUserTaxRate(profile.tax_rate ? profile.tax_rate / 100 : 0);
      }
    };
    fetchUserTaxRate();
  }, []);

  const totalProjectCosts = projects.reduce((sum, project) => 
    sum + (project?.qualifies_for_basis ? (project?.cost || 0) : 0), 0);
  
  const projectedTaxSavings = totalProjectCosts * userTaxRate;

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AccountHeader onSignOut={handleSignOut} />
      <main className="flex-grow w-full max-w-7xl mx-auto py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
          <div className="lg:col-span-2">
            <div className="lg:hidden mb-6">
              <TotalSavingsCard 
                projectedTaxSavings={projectedTaxSavings}
                totalProjectCosts={totalProjectCosts}
                userTaxRate={userTaxRate}
              />
            </div>
            {properties.length === 0 ? (
              <>
                <EmptyPropertyState onAddProperty={() => navigate("/property/edit")} />
                <WhySaveRecords />
              </>
            ) : (
              <ProjectAndTaxSection 
                selectedPropertyId={selectedPropertyId} 
                selectedProperty={selectedProperty}
              />
            )}
          </div>

          <div className="hidden lg:block space-y-6">
            <TotalSavingsCard 
              projectedTaxSavings={projectedTaxSavings}
              totalProjectCosts={totalProjectCosts}
              userTaxRate={userTaxRate}
            />
            <PremiumCard />
          </div>

          <div className="lg:hidden">
            <PremiumCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
