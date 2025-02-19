
import { useNavigate } from "react-router-dom";
import { PropertyList } from "@/components/property/PropertyList";
import { EmptyPropertyState } from "@/components/property/EmptyPropertyState";
import { useProperties } from "@/hooks/useProperties";
import { useEffect } from "react";
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

  if (properties.length === 0) {
    return <EmptyPropertyState onAddProperty={() => navigate("/property/edit")} />;
  }

  return (
    <div>
      <div className="flex justify-end pb-4 border-b">
        <AccountActions onAddProperty={() => navigate("/property/edit")} />
      </div>
      <div className="mt-4">
        <PropertyList 
          properties={properties} 
          selectedPropertyId={selectedPropertyId} 
          onPropertySelect={setSelectedPropertyId} 
          onEditProperty={handleEditProperty} 
        />
      </div>
    </div>
  );
}
