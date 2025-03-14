
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "@/components/project/form/file-fields/FileUploadButton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export interface ExtractedReceiptData {
  name: string;
  description: string;
  cost: string;
  completion_date?: Date;
  builder_name?: string;
}

interface ReceiptOCRModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  onSuccess: (data: ExtractedReceiptData) => void;
}

export function ReceiptOCRModal({ open, onClose, propertyId, onSuccess }: ReceiptOCRModalProps) {
  const [file, setFile] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!file || file.length === 0) {
      setError("Please select a receipt image to upload");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload the file to Supabase
      const receiptFile = file[0];
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${propertyId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ocr-receipts')
        .upload(filePath, receiptFile);

      if (uploadError) {
        throw new Error(`Error uploading receipt: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('ocr-receipts')
        .getPublicUrl(filePath);

      // Process the receipt with the edge function
      const { data, error: processError } = await supabase.functions
        .invoke('process-receipt', {
          body: { receiptUrl: publicUrl, propertyId },
        });

      if (processError) {
        throw new Error(`Error processing receipt: ${processError.message}`);
      }

      if (!data) {
        throw new Error("No data returned from receipt processing");
      }

      // Convert the date string to a Date object if available
      const dateObj = data.date ? new Date(data.date) : undefined;

      // Return the extracted data to the parent component
      onSuccess({
        name: data.name || "New Project",
        description: data.description || "",
        cost: data.cost || "0",
        completion_date: dateObj,
        builder_name: data.vendor || "",
      });

      toast({
        title: "Receipt processed successfully",
        description: "The information has been extracted and added to your project.",
      });
      
      onClose();
    } catch (err: any) {
      console.error("Receipt processing error:", err);
      setError(err.message || "Failed to process receipt");
      toast({
        variant: "destructive",
        title: "Error processing receipt",
        description: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (files: FileList) => {
    setFile(files);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Receipt for Automatic Data Extraction</DialogTitle>
          <DialogDescription>
            Upload a clear photo or scan of your receipt to automatically extract project details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <FileUploadButton
            value={file}
            onChange={handleFileChange}
            multiple={false}
            accept="image/*"
            label="Upload Receipt Image"
          />
          
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isLoading || !file}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Extract Data"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
