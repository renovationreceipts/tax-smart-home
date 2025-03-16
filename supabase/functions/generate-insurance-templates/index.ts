
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
      systemContent = "You are an AI that creates call scripts. Do not include any explanatory text, introductions, or notes. Generate only the exact script that the homeowner should say when calling their insurance provider.";
      prompt = `Create a direct call script for me to use when calling my insurance provider about my home improvement project: ${projectDescription}. I want to inform them and ask if I qualify for a discount. Do not include any introduction or explanation text, just the script itself.`;
    } else if (templateType === 'email') {
      systemContent = "You are an AI that creates email templates. Do not include any explanatory text, introductions, or notes. Generate only the exact email content that should be sent.";
      prompt = `Create a direct email template to send to my insurance provider about my home improvement project: ${projectDescription}. I want to inform them and ask if I qualify for a discount. Do not include any introduction or explanation text, just the email content itself.`;
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
