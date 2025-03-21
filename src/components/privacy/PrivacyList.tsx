import { ReactNode } from "react";

interface PrivacyListProps {
  items: ReactNode[];
}

const PrivacyList = ({ items }: PrivacyListProps) => {
  return (
    <ul className="list-disc pl-6 space-y-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export default PrivacyList;