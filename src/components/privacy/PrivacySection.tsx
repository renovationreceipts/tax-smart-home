import { ReactNode } from "react";

interface PrivacySectionProps {
  title: string;
  children: ReactNode;
}

const PrivacySection = ({ title, children }: PrivacySectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="space-y-4 text-muted-foreground">
        {children}
      </div>
    </div>
  );
};

export default PrivacySection;