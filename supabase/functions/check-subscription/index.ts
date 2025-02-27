
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
    // Get userId from the JWT
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
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

    // Get the user's subscription from the database
    const { data: subscription, error: subscriptionError } = await supabase
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

    // If the subscription is not active, check if they have a premium mark anyway
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_premium")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Profile check error:", profileError)
      return new Response(
        JSON.stringify({ error: "Error checking profile status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // If there's an active subscription but the profile is not marked as premium, fix it
    if (subscription && !profile.is_premium) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("id", user.id)

      if (updateError) {
        console.error("Profile update error:", updateError)
      }
    }

    // If there's no active subscription but the profile is marked as premium, fix it (unless it's special case)
    if (!subscription && profile.is_premium) {
      // This might be a special case where we manually set someone to premium
      // You could check a special "override" field here if needed
      
      // For now, we'll just correct the profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_premium: false })
        .eq("id", user.id)

      if (updateError) {
        console.error("Profile update error:", updateError)
      }
    }

    // Return the subscription status
    return new Response(
      JSON.stringify({
        isPremium: !!subscription || profile.is_premium,
        subscription: subscription || null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error("Error checking subscription:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
