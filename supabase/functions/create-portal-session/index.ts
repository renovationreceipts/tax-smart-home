
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.2.0";

// Updated CORS headers to allow multiple origins
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all origins - will be restricted by Supabase
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Stripe with the secret key
const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
const stripe = new Stripe(stripeKey, {
  httpClient: Stripe.createFetchHttpClient(),
});

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get the URL of the app to redirect users back to after they're done in the portal
const origin = Deno.env.get("FRONTEND_URL") || "http://localhost:3000";

serve(async (req) => {
  console.log("Portal session request received:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Verify configuration
    console.log("Checking environment configuration...");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY is not set in environment variables");
      return new Response(JSON.stringify({ error: "Stripe key configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase configuration missing");
      return new Response(JSON.stringify({ error: "Supabase configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.log("Environment configuration OK");

    // Get the current user's JWT
    console.log("Checking authorization header...");
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the JWT from the authorization header (format: "Bearer <token>")
    const token = authHeader.replace("Bearer ", "");

    // Verify the JWT and get the user
    console.log("Verifying user token...");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error("Invalid user token:", userError);
      return new Response(JSON.stringify({ error: "Invalid user token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Creating portal session for user ${user.id}`);

    // Get user's subscription details from the database
    console.log("Looking up subscription data in database...");
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (subscriptionError) {
      console.error("Database error during subscription lookup:", subscriptionError);
      return new Response(JSON.stringify({ error: "Database error during subscription lookup" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    if (!subscriptionData) {
      console.error("No subscription found for user:", user.id);
      return new Response(JSON.stringify({ error: "No subscription found for user" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    if (!subscriptionData.stripe_customer_id) {
      console.error("No Stripe customer ID found for user:", user.id);
      return new Response(JSON.stringify({ error: "No Stripe customer ID associated with user" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeCustomerId = subscriptionData.stripe_customer_id;
    console.log(`Found Stripe customer ${stripeCustomerId} with status: ${subscriptionData.status}`);

    try {
      // Verify the Stripe customer exists
      console.log("Verifying Stripe customer exists...");
      const customer = await stripe.customers.retrieve(stripeCustomerId);
      if (!customer || customer.deleted) {
        console.error("Stripe customer not found or deleted:", stripeCustomerId);
        return new Response(JSON.stringify({ error: "Stripe customer not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.log("Stripe customer verified successfully");
    } catch (stripeError) {
      console.error("Error retrieving Stripe customer:", stripeError);
      return new Response(JSON.stringify({ error: "Error retrieving Stripe customer" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a Stripe portal session for the customer
    console.log("Creating Stripe portal session...");
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${origin}/profile`,
      });

      console.log(`Created portal session, URL: ${session.url}`);

      // Return the portal session URL
      return new Response(
        JSON.stringify({ 
          url: session.url 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (stripeError) {
      console.error("Error creating Stripe portal session:", stripeError);
      const errorMessage = stripeError.message || "Unknown error";
      const errorType = stripeError.type || "unknown_type";
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to create portal session", 
          details: errorMessage,
          type: errorType
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error in create-portal-session:", error);
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error stack:", error.stack);
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString() 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
