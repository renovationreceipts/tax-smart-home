
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { MagicLinkEmail } from './_templates/magic-link.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

Deno.serve(async (req) => {
  // Set CORS headers for preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let payload;
  try {
    payload = await req.text();
  } catch (error) {
    console.error("Failed to read request body:", error);
    return new Response(JSON.stringify({ error: "Failed to read request body" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!payload) {
    console.error("Empty request payload");
    return new Response(JSON.stringify({ error: "Empty request payload" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const headers = Object.fromEntries(req.headers)
  const wh = new Webhook(hookSecret)
  
  try {
    let verifiedPayload;
    try {
      verifiedPayload = wh.verify(payload, headers) as {
        user: {
          email: string
        }
        email_data: {
          token: string
          token_hash: string
          redirect_to: string
          email_action_type: string
          site_url: string
        }
      };
    } catch (verifyError) {
      console.error("Webhook verification failed:", verifyError);
      return new Response(JSON.stringify({ error: "Webhook verification failed" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = verifiedPayload;

    // Validate redirect_to URL to ensure it's properly formatted
    let safeRedirectTo = redirect_to;
    try {
      // Ensure it's a valid URL
      new URL(safeRedirectTo);
      
      // Simple validation - ensure it's a renovationreceipts.com URL
      if (!safeRedirectTo.includes('renovationreceipts.com') && 
          !safeRedirectTo.includes('localhost')) {
        console.warn(`Suspicious redirect URL detected: ${safeRedirectTo}`);
        // Fall back to site root if redirect looks suspicious
        safeRedirectTo = Deno.env.get('SUPABASE_URL') ?? '';
      }
      
      // Make sure there's no # fragment which can break the auth flow
      const url = new URL(safeRedirectTo);
      if (url.hash) {
        console.warn(`Removing hash fragment from redirect URL: ${url.hash}`);
        url.hash = '';
        safeRedirectTo = url.toString();
      }
      
    } catch (e) {
      console.error(`Invalid redirect URL: ${safeRedirectTo}`, e);
      // Fall back to the supabase URL if the redirect_to is invalid
      safeRedirectTo = Deno.env.get('SUPABASE_URL') ?? '';
    }

    console.log(`Processing ${email_action_type} email for user: ${user.email}`);
    console.log(`Redirect URL: ${safeRedirectTo}`);
    
    let html;
    try {
      html = await renderAsync(
        React.createElement(MagicLinkEmail, {
          supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
          token,
          token_hash,
          redirect_to: safeRedirectTo,
          email_action_type,
        })
      );
    } catch (renderError) {
      console.error("Failed to render email template:", renderError);
      return new Response(JSON.stringify({ error: "Failed to render email template" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add retry mechanism for sending emails
    let maxRetries = 2;
    let retryCount = 0;
    let emailError = null;

    while (retryCount <= maxRetries) {
      try {
        const { error } = await resend.emails.send({
          from: 'Renovation Receipts <no-reply@renovationreceipts.com>',
          to: [user.email],
          subject: email_action_type === 'recovery' 
            ? 'Reset Your Renovation Receipts Password' 
            : 'Login to Renovation Receipts',
          html,
        });
        
        if (error) {
          emailError = error;
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          
          if (retryCount <= maxRetries) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        } else {
          // Success - break out of retry loop
          emailError = null;
          break;
        }
      } catch (err) {
        emailError = err;
        console.error(`Attempt ${retryCount + 1} threw an exception:`, err);
        retryCount++;
        
        if (retryCount <= maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    }
    
    if (emailError) {
      throw emailError;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Unknown error occurred',
          code: error.code || 500
        },
      }),
      {
        status: error.code || 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
