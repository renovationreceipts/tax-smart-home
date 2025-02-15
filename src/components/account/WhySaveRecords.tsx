
import { Home, Shield, FileText } from "lucide-react"

export function WhySaveRecords() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <h2 className="text-2xl font-bold mb-8">Why Save Your Records?</h2>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Home className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-xl">Proof for future home sale tax savings</span>
        </div>

        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-xl">Documentation for insurance claims</span>
        </div>

        <div className="flex items-start gap-4">
          <FileText className="h-6 w-6 mt-1 text-gray-600" />
          <span className="text-xl">Records for tax credits and deductions</span>
        </div>

        <div className="border-t my-6" />

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <FileText className="h-6 w-6 mt-1 text-gray-600" />
            <div>
              <h3 className="text-xl font-medium mb-2">You're making a smart choice! All your records are encrypted and securely stored.</h3>
              <p className="text-gray-600 text-lg">
                Your data is protected with bank-level security, ensuring your valuable home improvement history is safe and accessible when you need it.
              </p>
            </div>
          </div>
        </div>

        <button className="text-xl font-medium hover:underline">
          Learn More About Our Security
        </button>
      </div>
    </div>
  )
}
