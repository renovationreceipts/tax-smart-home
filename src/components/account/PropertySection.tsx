import { useNavigate } from "react-router-dom";
import { PropertyList } from "@/components/property/PropertyList";
import { EmptyPropertyState } from "@/components/property/EmptyPropertyState";
import { useProperties } from "@/hooks/useProperties";
import { useEffect } from "react";
import { House } from "lucide-react";
import { AccountActions } from "@/components/account/AccountActions";
interface PropertySectionProps {
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string) => void;
}
export function PropertySection({
  selectedPropertyId,
  setSelectedPropertyId
}: PropertySectionProps) {
  const navigate = useNavigate();
  const {
    data: properties = []
  } = useProperties();
  useEffect(() => {
    if (properties.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId, setSelectedPropertyId]);
  const handleEditProperty = (property: any) => {
    navigate(`/property/edit/${property.id}`);
  };
  return <div className="mb-8">
      {properties.length === 0 ? <EmptyPropertyState onAddProperty={() => navigate("/property/edit")} /> : <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <House className="h-5 w-5 text-[#0090FF]" />
                <h2 className="font-bold text-gray-900 text-2xl">Properties</h2>
              </div>
              <AccountActions onAddProperty={() => navigate("/property/edit")} />
            </div>
          </div>
          <div className="mt-4">
            <PropertyList properties={properties} selectedPropertyId={selectedPropertyId} onPropertySelect={setSelectedPropertyId} onEditProperty={handleEditProperty} />
          </div>
        </div>}
    </div>;
}