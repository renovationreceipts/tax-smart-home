
import { Home, Target, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyPropertyStateProps {
  onAddProperty: () => void
}

export function EmptyPropertyState({ onAddProperty }: EmptyPropertyStateProps) {
  return (
    <Card className="border-2">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span role="img" aria-label="house" className="text-3xl">🏡</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome to RenovationReceipts!
            </h2>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Target className="w-5 h-5 text-red-500" />
            <p className="text-lg text-gray-700">
              Your mission: Maximize savings & track your home's value!
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl space-y-4">
          {/* Step 1 */}
          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded">
              <span role="img" aria-label="diamond" className="text-xl">💎</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Step 1: Add Your First Property
              </h3>
              <p className="text-sm text-gray-600">Earn 100 XP!</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded">
              <span role="img" aria-label="diamond" className="text-xl">💎</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Step 2: Track Your First Renovation
              </h3>
              <p className="text-sm text-gray-600">Unlock tax benefits!</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded">
              <span role="img" aria-label="diamond" className="text-xl">💎</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Step 3: View Your Tax Savings
              </h3>
              <p className="text-sm text-gray-600">How much can you save?</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={onAddProperty}
          size="lg"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-6 text-lg font-medium"
        >
          <Trophy className="mr-2 h-5 w-5" />
          Get Started & Earn Your First Badge!
        </Button>
      </CardContent>
    </Card>
  )
}
