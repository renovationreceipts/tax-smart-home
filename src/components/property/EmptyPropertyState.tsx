import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyPropertyStateProps {
  onAddProperty: () => void
}

export function EmptyPropertyState({ onAddProperty }: EmptyPropertyStateProps) {
  return (
    <Card className="border rounded-lg">
      <CardContent className="flex flex-col items-center justify-center py-8 px-4 sm:py-12 sm:px-6 space-y-6 sm:space-y-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Welcome <span role="img" aria-label="waving hand">👋</span>
            </h2>
          </div>
          <div className="space-y-2">
            <p className="text-base sm:text-lg text-gray-700 max-w-xl">
              Add and track your home improvements, renovations and DIY projects to maximize your tax savings
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
          {/* Step 1 */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-3 sm:gap-4">
                <span role="img" aria-label="house" className="text-xl sm:text-2xl mt-1">🏠</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
                    Step 1: Add your property
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    We support primary homes, rentals, and vacation homes.
                  </p>
                </div>
              </div>
              <Button 
                onClick={onAddProperty}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
              >
                Add Property
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-3 sm:gap-4">
                <span role="img" aria-label="tools" className="text-xl sm:text-2xl mt-1">🛠️</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
                    Step 2: Track your renovations
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Store photos, receipts and document your projects for safekeeping.
                  </p>
                </div>
              </div>
              <Button 
                disabled
                className="w-full sm:w-auto bg-gray-200 text-gray-500"
              >
                Add Project
              </Button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-3 sm:gap-4">
                <span role="img" aria-label="money bag" className="text-xl sm:text-2xl mt-1">💰</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
                    Step 3: View your tax savings
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    The best part - see how much you can save by increasing the cost basis in your property
                  </p>
                </div>
              </div>
              <Button 
                disabled
                className="w-full sm:w-auto bg-gray-200 text-gray-500"
              >
                View Savings
              </Button>
            </div>
          </div>
        </div>

        <Button 
          onClick={onAddProperty}
          size="lg"
          className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-white px-6 py-3 text-base sm:text-lg"
        >
          Get started by adding your first property
        </Button>
      </CardContent>
    </Card>
  )
}
