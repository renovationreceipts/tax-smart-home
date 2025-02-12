
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyPropertyStateProps {
  onAddProperty: () => void
}

export function EmptyPropertyState({ onAddProperty }: EmptyPropertyStateProps) {
  return (
    <Card className="border rounded-lg">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome <span role="img" aria-label="waving hand">👋</span>
            </h2>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Your Mission:</h3>
            <p className="text-lg text-gray-700 max-w-xl">
              Track your home improvements and renovations and maximize your tax savings
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl space-y-6">
          {/* Step 1 */}
          <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-between">
            <div className="flex gap-4">
              <span role="img" aria-label="house" className="text-2xl">🏠</span>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Step 1: Add your property
                </h3>
                <p className="text-gray-600">
                  We support primary homes, rentals, and vacation homes.
                </p>
              </div>
            </div>
            <Button 
              onClick={onAddProperty}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add Property
            </Button>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-between">
            <div className="flex gap-4">
              <span role="img" aria-label="tools" className="text-2xl">🛠️</span>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Step 2: Track your renovations
                </h3>
                <p className="text-gray-600">
                  See if your renovations qualify for tax savings using our IRS-GPT analyzer.
                </p>
              </div>
            </div>
            <Button 
              disabled
              className="bg-gray-200 text-gray-500"
            >
              Add Project
            </Button>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-between">
            <div className="flex gap-4">
              <span role="img" aria-label="money bag" className="text-2xl">💰</span>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Step 3: View your tax savings
                </h3>
                <p className="text-gray-600">
                  The best part - see how much you can save by increasing the cost basis in your property
                </p>
              </div>
            </div>
            <Button 
              disabled
              className="bg-gray-200 text-gray-500"
            >
              View Savings
            </Button>
          </div>
        </div>

        <Button 
          onClick={onAddProperty}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg w-full max-w-2xl"
        >
          Get started by adding your first property
        </Button>
      </CardContent>
    </Card>
  )
}
