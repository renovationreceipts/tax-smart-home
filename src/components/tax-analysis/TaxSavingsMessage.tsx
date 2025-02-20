
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

interface TaxSavingsMessageProps {
  taxSavings: number;
}

export function TaxSavingsMessage({ taxSavings }: TaxSavingsMessageProps) {
  if (taxSavings <= 0) return null;

  return (
    <div className="mt-6 space-y-2 text-center">
      <p className="text-blue-500 font-semibold flex items-center gap-2 text-lg justify-center">
        <span className="text-2xl">💰</span>
        By tracking home improvements, you saved {formatCurrency(taxSavings)} in taxes!
      </p>
      <p className="text-gray-600 text-base">
        Update your tax filing status, federal cap gains rate, and home value appreciation rate in your{" "}
        <Link to="/profile" className="text-blue-500 hover:underline">
          Profile
        </Link>
        .
      </p>
    </div>
  );
}
