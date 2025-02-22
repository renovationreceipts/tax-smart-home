
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();

    const prompt = `Analyze this home improvement project and determine its eligibility for three categories. Format your response in JSON:
    Project Description: "${description}"
    
    Evaluate for:
    1. Cost Basis Adjustment: Does this qualify to be added to the home's cost basis for tax purposes?
    2. Tax Credits: Are there any available tax credits for this type of improvement?
    3. Insurance Premium Reduction: Could this improvement qualify for insurance premium reductions?
    
    Return the analysis in this exact JSON format:
    {
      "costBasis": {
        "qualifies": boolean,
        "analysis": "detailed explanation"
      },
      "taxCredits": {
        "qualifies": boolean,
        "analysis": "detailed explanation"
      },
      "insuranceReduction": {
        "qualifies": boolean,
        "analysis": "detailed explanation"
      }
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'ft:gpt-3.5-turbo-0125:personal:2-20-25:B3AHYUv9',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in IRS Publication 523, an expert in understanding tax credits and subsidies detailed in IRS Publication 523 sections 25C and 25D, and an expert in homeowners insurance underwriting practices such that you can identify home improvements that qualify for premium reduction. Provide accurate analysis of this home improvement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-project function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
