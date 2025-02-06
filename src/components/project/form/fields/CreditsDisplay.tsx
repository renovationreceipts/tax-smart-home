import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CreditsDisplayProps {
  used: number
  limit: number
}

export function CreditsDisplay({ used, limit }: CreditsDisplayProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm text-gray-500 cursor-help">
            {used}/{limit} credits used
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px]">
          <p>You have {limit} free credits to analyze projects with IRS-GPT. This limit helps us manage costs while providing this service for free.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}