
import { formatCurrency } from "@/lib/utils"

interface TaxAnalysisHeaderProps {
  projectedTaxSavings: number
}

export function TaxAnalysisHeader({ projectedTaxSavings }: TaxAnalysisHeaderProps) {
  return (
    <div>
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Full Savings Analysis</h1>
        <p className="text-gray-500 text-lg">Comprehensive breakdown of your potential savings</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-8 mt-6 text-center">
        <div className="text-5xl font-bold mb-2">{formatCurrency(projectedTaxSavings)}</div>
        <div className="text-gray-500 text-lg">Lifetime projected savings</div>
      </div>
    </div>
  )
}
