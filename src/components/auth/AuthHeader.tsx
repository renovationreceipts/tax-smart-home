
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}

export function AuthBackButton() {
  return (
    <Link
      to="/"
      className="absolute top-4 left-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to home
    </Link>
  );
}
