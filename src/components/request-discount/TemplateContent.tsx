
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplateContentProps {
  isLoading: boolean;
  content: string | null;
  type: "script" | "email";
  onCopy: (text: string) => void;
}

export function TemplateContent({ isLoading, content, type, onCopy }: TemplateContentProps) {
  if (isLoading) {
    return (
      <div>
        <div className="relative mb-6">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
        </div>
        <div className="relative mb-6">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/5 mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
        </div>
        <div className="relative">
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/5 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="absolute top-0 right-0">
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <p className="text-gray-500 text-center py-4">
        Failed to generate {type === "script" ? "call script" : "email template"}. Please try refreshing the page.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="whitespace-pre-line">
        {content}
      </div>
      <Button 
        variant="outline" 
        size="sm"
        className="absolute top-0 right-0" 
        onClick={() => onCopy(content)}
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy {type === "script" ? "Script" : "Email"}
      </Button>
    </div>
  );
}
