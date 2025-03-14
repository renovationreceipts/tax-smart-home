
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { receiptUrl, propertyId } = await req.json();
    console.log(`Processing receipt: ${receiptUrl} for property: ${propertyId}`);

    if (!receiptUrl) {
      throw new Error('Receipt URL is required');
    }

    // Get the image data
    const imageResponse = await fetch(receiptUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(
      String.fromCharCode(...new Uint8Array(imageArrayBuffer))
    );

    // Google Vision API credentials - stored as a Supabase secret
    let credentials;
    try {
      const credentialsString = Deno.env.get('GOOGLE_VISION_CREDENTIALS');
      if (!credentialsString) {
        throw new Error('Google Vision credentials not found');
      }
      credentials = JSON.parse(credentialsString);
      console.log("Successfully loaded Google credentials");
    } catch (error) {
      console.error("Error parsing Google credentials:", error);
      throw new Error('Invalid Google Vision API credentials');
    }

    // Configure the Vision API request
    const visionEndpoint = 'https://vision.googleapis.com/v1/images:annotate';
    const visionPayload = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            { type: 'TEXT_DETECTION' },
            { type: 'DOCUMENT_TEXT_DETECTION' }
          ]
        }
      ]
    };

    // Get the access token (self-signed JWT)
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600; // 1 hour expiration

    const jwtHeader = { alg: 'RS256', typ: 'JWT' };
    const jwtPayload = {
      iss: credentials.client_email,
      sub: credentials.client_email,
      aud: 'https://vision.googleapis.com/',
      iat,
      exp,
    };

    // Create the JWT components
    const base64UrlEncode = (str: string) => {
      return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    };

    const headerEncoded = base64UrlEncode(JSON.stringify(jwtHeader));
    const payloadEncoded = base64UrlEncode(JSON.stringify(jwtPayload));
    const toSign = `${headerEncoded}.${payloadEncoded}`;

    // Convert private key to CryptoKey
    const privateKey = credentials.private_key.replace(/\\n/g, '\n');
    const importedKey = await crypto.subtle.importKey(
      'pkcs8',
      new TextEncoder().encode(privateKey),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Sign the JWT
    const signature = await crypto.subtle.sign(
      { name: 'RSASSA-PKCS1-v1_5' },
      importedKey,
      new TextEncoder().encode(toSign)
    );

    const signatureBase64 = base64UrlEncode(
      String.fromCharCode(...new Uint8Array(signature))
    );

    // Combine to form the complete JWT
    const jwt = `${toSign}.${signatureBase64}`;

    console.log("JWT token generated successfully");

    // Call the Vision API with the token
    const visionResponse = await fetch(visionEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(visionPayload)
    });

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error("Vision API error:", errorText);
      throw new Error(`Vision API error: ${visionResponse.status}`);
    }

    const visionData = await visionResponse.json();
    console.log("Vision API response received");

    // Process the OCR results
    const textAnnotations = visionData.responses[0]?.textAnnotations || [];
    const fullText = textAnnotations[0]?.description || '';
    console.log("Extracted text:", fullText);

    // Extract relevant information
    // This is a simple version - in a production app, you might use more sophisticated
    // text extraction or even machine learning to identify fields more accurately
    
    // Default result structure
    const result = {
      name: "",
      description: "",
      cost: "",
      date: null,
      vendor: ""
    };

    // Extract amount (look for currency symbols and numbers)
    const amountRegex = /\$\s?([0-9,]+(\.[0-9]{2})?)/g;
    const amounts = [...fullText.matchAll(amountRegex)];
    if (amounts.length > 0) {
      // Assume the largest amount is the total
      let highestAmount = 0;
      amounts.forEach(match => {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (amount > highestAmount) {
          highestAmount = amount;
          result.cost = amount.toString();
        }
      });
    }

    // Extract date (common formats)
    const dateRegex = /([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/g;
    const dates = fullText.match(dateRegex);
    if (dates && dates.length > 0) {
      result.date = dates[0]; // Use the first date found
    }

    // Try to extract vendor name (typically at the top of receipt)
    const lines = fullText.split('\n');
    if (lines.length > 0) {
      // Often the vendor name is in the first few lines
      // Skip very short lines as they're likely not the business name
      for (let i = 0; i < Math.min(3, lines.length); i++) {
        if (lines[i].length > 3 && !/^[0-9\$\.\,\:\/]+$/.test(lines[i])) {
          result.vendor = lines[i].trim();
          break;
        }
      }
    }

    // Set a name for the project based on the vendor if found
    if (result.vendor) {
      result.name = `${result.vendor} Project`;
    } else {
      result.name = "Home Improvement Project";
    }

    // Set a simple description
    result.description = `Project based on receipt uploaded on ${new Date().toLocaleDateString()}`;

    console.log("Extracted data:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error processing receipt:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process receipt' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
