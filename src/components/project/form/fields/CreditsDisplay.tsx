
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
          <span className="text-sm text-gray-500 cursor-help text-right w-full">
            {used} AI requests made
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px]">
          <p>You've used AI assistance {used} times to analyze your projects.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
