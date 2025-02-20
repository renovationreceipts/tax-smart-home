
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTooltip } from "@/hooks/useTooltip";

interface InfoTooltipProps {
  title: string;
  content: string;
}

export function InfoTooltip({ title, content }: InfoTooltipProps) {
  const { isOpen, tooltipRef, handleInfoClick } = useTooltip();

  return (
    <TooltipProvider>
      <Tooltip open={isOpen}>
        <TooltipTrigger asChild>
          <Info 
            className="h-4 w-4 text-gray-400 cursor-pointer" 
            onClick={handleInfoClick}
          />
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-sm" 
          ref={tooltipRef}
          sideOffset={5}
        >
          <div className="space-y-2">
            <p className="font-semibold">{title}</p>
            <p className="text-sm">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
