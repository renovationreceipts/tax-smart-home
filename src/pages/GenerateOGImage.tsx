
import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import SocialPreview from '@/components/SocialPreview';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export default function GenerateOGImage() {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateAndUploadImage = async () => {
      if (!previewRef.current) return;

      try {
        const canvas = await html2canvas(previewRef.current);
        const blob = await new Promise<Blob>((resolve) => 
          canvas.toBlob((blob) => resolve(blob!), 'image/png')
        );

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('social_images')
          .upload('og-image.png', blob, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Error",
            description: "Failed to upload OG image",
            variant: "destructive"
          });
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('social_images')
          .getPublicUrl('og-image.png');

        toast({
          title: "Success",
          description: "OG image has been generated and uploaded",
        });

        console.log('OG image URL:', publicUrl);
      } catch (error) {
        console.error('Generation error:', error);
        toast({
          title: "Error",
          description: "Failed to generate OG image",
          variant: "destructive"
        });
      }
    };

    generateAndUploadImage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div ref={previewRef}>
        <SocialPreview />
      </div>
    </div>
  );
}
