interface TermsSectionProps {
  title: string;
  children: React.ReactNode;
}

const TermsSection = ({ title, children }: TermsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  );
};

export default TermsSection;