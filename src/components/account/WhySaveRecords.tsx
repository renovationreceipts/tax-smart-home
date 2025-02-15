
import { Home, Shield, FileText } from "lucide-react";
export function WhySaveRecords() {
  return <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <h2 className="font-bold mb-8 text-lg">Why Save Your Records?</h2>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Home className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-base">Proof for future home sale tax savings</span>
        </div>

        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-base">Documentation for insurance claims</span>
        </div>

        <div className="flex items-start gap-4">
          <FileText className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-base">Records for tax credits and deductions</span>
        </div>

        <div className="border-t my-6" />

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <FileText className="h-6 w-6 mt-1 text-gray-600" />
            <div>
              <h3 className="font-medium mb-2 text-base">You're making a smart choice! All your records are encrypted and securely stored.</h3>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
