import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

async function callOpenAI(description: string, attempt = 1): Promise<Response> {
  try {
    console.log(`Attempt ${attempt} to analyze description:`, description);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
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
      }),
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();
    console.log('Analyzing project description:', description);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await callOpenAI(description);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "The analysis service is busy. Please wait a moment and try again."
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    return new Response(JSON.stringify({ 
      analysis: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-project function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred'
    }), {
      status: error.status || 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});