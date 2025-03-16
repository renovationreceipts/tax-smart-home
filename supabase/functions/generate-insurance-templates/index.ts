
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { projectDescription, templateType } = await req.json();
    
    if (!projectDescription) {
      throw new Error('Project description is required');
    }

    let prompt;
    let systemContent;

    if (templateType === 'call') {
      systemContent = "You are a professional assistant that generates polite, effective call scripts for homeowners to speak with their insurance providers about recent home improvements and potential policy updates or discounts.";
      prompt = `I recently completed a home improvement project: ${projectDescription}. I want to call my insurance provider to inform them and ask if I qualify for a discount or policy update. Can you generate a call script I can follow?`;
    } else if (templateType === 'email') {
      systemContent = "You are a professional assistant that drafts clear, polite, and persuasive emails to insurance providers about home improvements for potential discounts.";
      prompt = `I recently completed a home improvement project: ${projectDescription}. I want to draft an email to my insurance provider to inquire about a discount on my homeowners insurance.`;
    } else {
      throw new Error('Invalid template type');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ text: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-insurance-templates function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
