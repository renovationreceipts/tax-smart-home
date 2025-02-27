
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProjectAndTaxSection } from "@/components/account/ProjectAndTaxSection";
import { AccountHeader } from "@/components/account/AccountHeader";
import { EmptyPropertyState } from "@/components/property/EmptyPropertyState";
import { WhySaveRecords } from "@/components/account/WhySaveRecords";
import { TotalSavingsCard } from "@/components/account/TotalSavingsCard";
import { ShareCard } from "@/components/account/ShareCard";
import { useState, useEffect } from "react";
import { useProperties } from "@/hooks/useProperties";
import { useProjects } from "@/hooks/useProjects";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { PremiumModal } from "@/components/premium/PremiumModal";

export default function Account() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [userTaxRate, setUserTaxRate] = useState(0);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const { data: properties = [] } = useProperties();
  const { data: projects = [] } = useProjects(selectedPropertyId);
  const { isPremium } = usePremiumStatus();
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  
  const propertyIdFromUrl = searchParams.get('propertyId');

  useEffect(() => {
    if (propertyIdFromUrl) {
      // If there's a property ID in the URL, use it
      setSelectedPropertyId(propertyIdFromUrl);
    } else if (properties.length > 0 && !selectedPropertyId) {
      // If no property ID in URL and we have properties, use the first one
      setSelectedPropertyId(properties[0].id);
      setSearchParams({ propertyId: properties[0].id });
    }
  }, [properties, propertyIdFromUrl, selectedPropertyId, setSearchParams]);

  // Handle property selection from dropdown
  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setSearchParams({ propertyId });
  };

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

  const handleViewAnalysis = () => {
    if (selectedPropertyId) {
      navigate(`/tax-analysis?propertyId=${selectedPropertyId}`);
    } else {
      navigate('/tax-analysis');
    }
  };

  const handleAddProperty = () => {
    if (!isPremium && properties.length >= 1) {
      setIsPremiumModalOpen(true);
    } else {
      navigate("/property/edit");
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
                propertyId={selectedPropertyId}
                onViewAnalysis={handleViewAnalysis}
              />
            </div>
            {properties.length === 0 ? (
              <>
                <EmptyPropertyState onAddProperty={handleAddProperty} />
                <WhySaveRecords />
              </>
            ) : (
              <ProjectAndTaxSection 
                selectedPropertyId={selectedPropertyId} 
                selectedProperty={selectedProperty}
                onPropertySelect={handlePropertySelect}
                isPremium={isPremium}
              />
            )}
          </div>

          <div className="hidden lg:block space-y-6">
            <TotalSavingsCard 
              projectedTaxSavings={projectedTaxSavings}
              totalProjectCosts={totalProjectCosts}
              userTaxRate={userTaxRate}
              propertyId={selectedPropertyId}
              onViewAnalysis={handleViewAnalysis}
            />
            <ShareCard />
          </div>

          <div className="lg:hidden">
            <ShareCard />
          </div>
        </div>
      </main>
      
      <PremiumModal
        open={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        propertyCount={properties.length}
        projectCount={projects.length}
      />
    </div>
  );
}
