import { Home, Shield, FileText } from "lucide-react";
export function WhySaveRecords() {
  return <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <h2 className="font-bold mb-8 text-2xl">Why Save Your Records?</h2>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Home className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-base font-normal"><strong>Future Tax Savings</strong>: Lower your taxable gains by documenting increases your cost basis.</span>
        </div>

        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-base">Documentation for Insurance Claims: Have proof of home upgrades when you need it most.</span>
        </div>

        <div className="flex items-start gap-4">
          <FileText className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-base">Audit-Proof Records: Have the backup you need to support tax credits and deductions.</span>
        </div>
      </div>
    </div>;
}