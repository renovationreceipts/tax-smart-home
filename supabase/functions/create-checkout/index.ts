
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1"
import Stripe from "https://esm.sh/stripe@11.1.0?target=deno"

// Supabase client setup
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
const supabase = createClient(supabaseUrl, supabaseKey)

// Stripe setup
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") ?? ""
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
})

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Processing checkout request")
    
    // Get userId from the JWT
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      console.error("Missing Authorization header")
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const token = authHeader.split(" ")[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error("Auth error:", authError)
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Get website URL from request
    const { success_url, cancel_url } = await req.json()
    
    if (!success_url || !cancel_url) {
      console.error("Missing success_url or cancel_url")
      return new Response(
        JSON.stringify({ error: "Missing success_url or cancel_url" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Verify that user doesn't already have active subscription
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle()

    if (subscriptionError) {
      console.error("Subscription check error:", subscriptionError)
      return new Response(
        JSON.stringify({ error: "Error checking subscription status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (subscriptions) {
      console.log("User already has an active subscription")
      return new Response(
        JSON.stringify({ 
          error: "You already have an active subscription",
          redirectUrl: success_url
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Get user email from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Profile error:", profileError)
      return new Response(
        JSON.stringify({ error: "Error fetching user profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Create a Stripe checkout session using a fixed price ID
    const priceId = "price_1QxDfhKGEKCGMor2R32CtdhQ" // Your specific Stripe price ID
    
    console.log("Creating checkout session with price:", priceId)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: success_url,
      cancel_url: cancel_url,
      customer_email: profile.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
      },
    })

    console.log("Checkout session created successfully")
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error("Error creating checkout session:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
