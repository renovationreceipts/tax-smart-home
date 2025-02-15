import { Home, Shield, FileText } from "lucide-react";
export function WhySaveRecords() {
  return <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <h2 className="font-bold mb-8 text-2xl">Why Save Your Records?</h2>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Home className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-base font-normal">Future Tax Savings: Detailed records will help you lower your taxable gains by proving your cost basis when you sell.</span>
        </div>

        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-base">Documentation for insurance claims</span>
        </div>

        <div className="flex items-start gap-4">
          <FileText className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-base">Records for tax credits and deductions</span>
        </div>
      </div>
    </div>;
}