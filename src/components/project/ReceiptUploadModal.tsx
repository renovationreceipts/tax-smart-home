
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "@/components/project/form/file-fields/FileUploadButton";
import { Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReceiptUploadModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  onSuccess: (extractedData: ExtractedReceiptData) => void;
}

export interface ExtractedReceiptData {
  name: string;
  description?: string;
  cost: string;
  completion_date: Date;
  builder_name?: string;
}

export function ReceiptUploadModal({ open, onClose, propertyId, onSuccess }: ReceiptUploadModalProps) {
  const [receiptFile, setReceiptFile] = useState<FileList | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (files: FileList) => {
    setReceiptFile(files);
  };

  const handleProcessReceipt = async () => {
    if (!receiptFile || receiptFile.length === 0) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload a receipt image first."
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Upload the file to Supabase storage temporarily
      const file = receiptFile[0];
      const tempFilePath = `temp/${crypto.randomUUID()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(tempFilePath, file, {
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get a public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(tempFilePath);

      // Call the edge function to process the receipt
      const { data, error } = await supabase.functions.invoke('process-receipt', {
        body: { 
          receiptUrl: publicUrl,
          propertyId 
        }
      });

      // Clean up the temporary file
      await supabase.storage
        .from('project-files')
        .remove([tempFilePath]);

      if (error) {
        throw new Error(`Processing failed: ${error.message}`);
      }

      // Handle successful OCR
      toast({
        title: "Receipt Processed",
        description: "Information extracted successfully."
      });
      
      // Convert the cost to currency format if it's a number
      let formattedCost = data.cost;
      if (!isNaN(Number(data.cost))) {
        formattedCost = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(data.cost));
      }

      // Pass the extracted data back to the parent component
      onSuccess({
        name: data.name || "Home Improvement Project",
        description: data.description || "",
        cost: formattedCost,
        completion_date: data.date ? new Date(data.date) : new Date(),
        builder_name: data.vendor || ""
      });
      
      // Close the modal
      onClose();

    } catch (error) {
      console.error("Receipt processing error:", error);
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Failed to process receipt. Please try manual entry."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Receipt</DialogTitle>
          <DialogDescription>
            Upload a receipt image to automatically extract project information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <FileUploadButton
            value={receiptFile}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            label="Upload Receipt"
          />
          
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-500">
              For best results:
            </p>
            <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
              <li>Upload a clear, well-lit image</li>
              <li>Make sure the receipt is flat and not crumpled</li>
              <li>Ensure the total amount, date, and vendor name are visible</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleProcessReceipt} disabled={!receiptFile || isProcessing || receiptFile.length === 0}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Process Receipt
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
