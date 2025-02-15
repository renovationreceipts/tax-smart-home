
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FINE_TUNED_MODEL = 'ft:gpt-3.5-turbo-0125:personal:cost-basis:AxaH9ph8';
const RETRY_DELAY = 2000;
const MAX_RETRIES = 3;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface AnalysisResult {
  qualifies: boolean;
  analysis: string;
}

function parseAnalysisResponse(content: string): AnalysisResult {
  const lowerContent = content.toLowerCase();
  // Look for clear yes/no indicators at the start of the response
  const qualifies = lowerContent.includes('yes') && !lowerContent.includes('no');
  
  return {
    qualifies,
    analysis: content
  };
}

function createOpenAIRequest(description: string) {
  return {
    model: FINE_TUNED_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that analyzes home improvement projects to determine if they qualify for increasing the cost basis according to IRS guidelines. 
        Focus on whether the project:
        1. Adds to the property's value
        2. Prolongs its useful life
        3. Adapts it to new uses
        Provide a clear yes/no recommendation with a brief explanation based on IRS Publication 523.`
      },
      {
        role: 'user',
        content: `Please analyze this home improvement project and tell me if it likely qualifies for increasing the cost basis: ${description}`
      }
    ],
  };
}

async function callOpenAI(description: string, attempt = 1): Promise<Response> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  console.log(`Attempt ${attempt} to analyze description:`, description);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createOpenAIRequest(description)),
    });

    if (response.status === 429 && attempt < MAX_RETRIES) {
      console.log(`Rate limited on attempt ${attempt}, retrying after delay...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return callOpenAI(description, attempt + 1);
    }

    return response;
  } catch (error) {
    console.error(`Error on attempt ${attempt}:`, error);
    throw error;
  }
}

async function handleAnalysisRequest(req: Request): Promise<Response> {
  try {
    const { description } = await req.json();
    console.log('Analyzing project description:', description);

    const response = await callOpenAI(description);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "The analysis service is busy. Please wait a moment and try again."
          }), 
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json() as OpenAIResponse;
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    const analysisResult = parseAnalysisResponse(data.choices[0].message.content);
    console.log('Analysis result:', analysisResult);

    return new Response(
      JSON.stringify(analysisResult), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-project function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }), 
      {
        status: error.status || 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return handleAnalysisRequest(req);
});
