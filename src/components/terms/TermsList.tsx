interface TermsListProps {
  items: string[];
}

const TermsList = ({ items }: TermsListProps) => {
  return (
    <ul className="list-disc pl-6 space-y-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export default TermsList;