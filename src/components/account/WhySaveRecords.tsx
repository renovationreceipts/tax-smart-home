
import { Home, Shield, FileText, Archive } from "lucide-react";
export function WhySaveRecords() {
  return <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <div className="flex items-center gap-2">
        <Archive className="h-6 w-6 text-[#0090FF]" />
        <h2 className="font-bold text-2xl">Why Save Records?</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 rounded-full p-3 mb-4">
            <Home className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2"><strong>Secure Future Tax Savings</strong></h3>
          <p className="text-gray-600">Lower your taxable gains by documenting increases in your cost basis.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 rounded-full p-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2"><strong>Documentation for Insurance Claims</strong></h3>
          <p className="text-gray-600">Have proof of home upgrades when you need it most.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 rounded-full p-3 mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2"><strong>Audit-Proof Records</strong></h3>
          <p className="text-gray-600">Have the backup you need to support tax credits and deductions.</p>
        </div>
      </div>
    </div>;
}
