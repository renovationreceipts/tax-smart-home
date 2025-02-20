import { Rocket, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export function PremiumCard() {
  return <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2">
        <Rocket className="h-6 w-6 text-[#0090FF]" />
        <h2 className="font-bold mb-2 text-2xl">Go Premium</h2>
      </div>
      <p className="text-gray-500 mb-6"></p>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700">Unlimited project storage</span>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700">Export to tax filing format (XML, PDF, TXF, CSV)</span>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700">Unlimited properties</span>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700">Homeowners insurance savings check</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold inline-flex items-baseline">
          $10
          <span className="text-lg text-gray-500 font-normal">/year</span>
        </div>
      </div>

      <Button className="w-full text-white bg-[#2463eb]" disabled>
        Premium Plan Coming Soon
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>;
}