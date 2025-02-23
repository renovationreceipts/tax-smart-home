
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function ShareCard() {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const shareUrl = window.location.origin;

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Track Home Improvements',
          text: 'Check out this app for tracking home improvements and saving on taxes!',
          url: shareUrl,
        });
        toast({
          title: "Thanks for sharing!",
          description: "We appreciate you spreading the word.",
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "The website URL has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: "Sharing failed",
          description: "Please try again or copy the URL manually.",
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-6 w-6 text-[#0090FF]" />
          <h3 className="text-2xl font-semibold">Share with Friends</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Know someone who could benefit from tracking their home improvements? Share this app with them!
        </p>

        <Button
          onClick={handleShare}
          disabled={isSharing}
          variant="outline"
          className="w-full text-[#0090FF] border-[#0090FF] hover:bg-[#0090FF]/5"
        >
          <Share2 className="mr-2 h-4 w-4" />
          {isSharing ? "Sharing..." : "Share"}
        </Button>
      </div>
    </div>
  );
}
