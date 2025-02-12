
import { useState, useEffect } from "react"
import { Check, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TaxSavingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContinue: () => void
}

const checklistItems = [
  {
    id: 1,
    text: "Tax savings — Increase the cost basis in your home and save on capital gains tax"
  },
  {
    id: 2,
    text: "Audit protection — you need records of your cost basis if the IRS ever questions your sale"
  },
  {
    id: 3,
    text: "Insurance claims proof - digital record and photographic proof of improvements"
  },
  {
    id: 4,
    text: "Rental conversions & estate planning — if you ever rent out or pass down your home, cost basis tracking reduces taxable gains"
  }
]

export function TaxSavingsModal({ open, onOpenChange, onContinue }: TaxSavingsModalProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [showContinue, setShowContinue] = useState(false)
  
  useEffect(() => {
    if (open) {
      setVisibleItems([])
      setShowContinue(false)
      
      // Show items one by one
      checklistItems.forEach((item, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, item.id])
          
          // Show continue button after last item
          if (index === checklistItems.length - 1) {
            setTimeout(() => setShowContinue(true), 1000)
          }
        }, (index + 1) * 2000) // Show new item every 2 seconds
      })
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Why Tracking Home Projects is Important
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {/* Animated loader */}
          <div className={`flex justify-center ${showContinue ? 'hidden' : ''}`}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>

          {/* Checklist */}
          <div className="space-y-4 mt-6">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 transition-all duration-500 ${
                  visibleItems.includes(item.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p className="text-gray-600 leading-tight">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Continue button */}
          {showContinue && (
            <div className="mt-8 flex justify-center animate-fade-in">
              <Button onClick={onContinue} className="w-full sm:w-auto">
                Continue to Tax Savings
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
