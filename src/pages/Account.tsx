import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Info, Lock, Building2, Banknote, FileText, CircleDollarSign, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectAndTaxSection } from "@/components/account/ProjectAndTaxSection";
import { AccountHeader } from "@/components/account/AccountHeader";
import { EmptyPropertyState } from "@/components/property/EmptyPropertyState";
import { WhySaveRecords } from "@/components/account/WhySaveRecords";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useProperties } from "@/hooks/useProperties";
import { useProjects } from "@/hooks/useProjects";
import { formatCurrency } from "@/lib/utils";

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
      const { data: profile } = await supabase.from('profiles').select('tax_rate').eq('id', user.id).single();
      if (profile) {
        setUserTaxRate(profile.tax_rate ? profile.tax_rate / 100 : 0);
      }
    };
    fetchUserTaxRate();
  }, []);

  const totalProjectCosts = projects.reduce((sum, project) => sum + (project?.cost || 0), 0);
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

  const TotalSavingsCard = () => <div className="bg-white rounded-xl shadow-sm">
      <div className="hidden sm:flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-6 w-6 text-[#0090FF]" />
          <h3 className="text-2xl font-semibold">Total Savings</h3>
        </div>
      </div>

      <div className="sm:hidden py-4 px-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold mb-1">{formatCurrency(projectedTaxSavings)}</div>
            <div className="text-gray-600 text-sm">Lifetime projected savings</div>
          </div>
          <Button 
            variant="link" 
            onClick={() => navigate("/tax-analysis")} 
            className="text-[#0090FF] hover:text-[#0090FF]/90 p-0 text-sm"
          >
            View Details
          </Button>
        </div>
      </div>

      <div className="hidden sm:block px-6">
        <div className="mb-8">
          <div className="text-center">
            <div className="text-4xl font-semibold leading-none mb-2">{formatCurrency(projectedTaxSavings)}</div>
            <div className="text-gray-500 text-sm">Lifetime projected savings</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Total Projects Cost</span>
            </div>
            <span className="text-sm">{formatCurrency(totalProjectCosts)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-gray-400" />
              <span className="text-sm">x Your Tax Rate</span>
            </div>
            <span className="text-sm">{(userTaxRate * 100).toFixed(1)}%</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-lg">
              <Banknote className="h-5 w-5 text-gray-400" />
              <span className="text-sm">= Lifetime savings</span>
            </div>
            <span className="text-sm">{formatCurrency(projectedTaxSavings)}</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => navigate("/tax-analysis")} 
          className="w-full mt-8 text-[#0090FF] border-[#0090FF] hover:bg-[#0090FF]/5 font-normal my-[28px]"
        >
          View Full Analysis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>;

  const PremiumCard = () => <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2">
        <Rocket className="h-6 w-6 text-[#0090FF]" />
        <h2 className="font-bold mb-2 text-2xl">Go Premium</h2>
      </div>
      <p className="text-gray-500 mb-6"></p>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700">Generate IRS-ready tax documents</span>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700">Insurance discount request package</span>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700">Continuous monitoring for new savings</span>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700">Unlimited project storage</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold inline-flex items-baseline">
          $10
          <span className="text-lg text-gray-500 font-normal">/year</span>
        </div>
      </div>

      <Button className="w-full text-white bg-[#2463eb]">
        Generate Documents
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>;

  return <div className="min-h-screen flex flex-col bg-gray-50">
      <AccountHeader onSignOut={handleSignOut} />
      <main className="flex-grow w-full max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="lg:hidden mb-6">
              <TotalSavingsCard />
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
            <TotalSavingsCard />
            <PremiumCard />
          </div>

          <div className="lg:hidden">
            <PremiumCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>;
}
