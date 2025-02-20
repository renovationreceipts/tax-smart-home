
import { Card } from "@/components/ui/card";

export function NoSavingsMessage() {
  return (
    <Card className="p-6 bg-gray-50 border-gray-200">
      <h3 className="text-lg font-semibold mb-2">No Tax Savings Yet</h3>
      <p className="text-gray-600">
        While you're not seeing tax savings yet, tracking your home improvements is still crucial. 
        As your home appreciates in value, these records could save you thousands in taxes when you sell. 
        Plus, having organized records helps with insurance claims and auditability of tax credits and other rebates.
      </p>
    </Card>
  );
}
