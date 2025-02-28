
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.2.0";

// Initialize Stripe with the secret key
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  httpClient: Stripe.createFetchHttpClient(),
});

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Verify user's authentication (get from Authorization header)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ isPremium: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract the JWT from the Authorization header
    const token = authHeader.replace("Bearer ", "");

    // Verify the JWT and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ isPremium: false, error: "Authentication error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if the user has a subscription in the database
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (subscriptionError) {
      console.log("No subscription found for user", user.id);
      // No error thrown - just no subscription found
      // Update the user's premium status in their profile if needed
      await updateUserPremiumStatus(user.id, false);
      return new Response(
        JSON.stringify({ isPremium: false, subscription: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If we have a subscription record but no stripe_subscription_id, that's odd
    if (!subscriptionData.stripe_subscription_id) {
      console.log("Subscription record found but no Stripe ID for user", user.id);
      await updateUserPremiumStatus(user.id, false);
      return new Response(
        JSON.stringify({ isPremium: false, subscription: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // We have a subscription record, but need to check its current status in Stripe
    // to make sure it's active and not past due, canceled, etc.
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionData.stripe_subscription_id);

    // Determine premium status
    const isPremium = stripeSubscription.status === "active";
    
    // Update the subscription status in our database if needed
    if (subscriptionData.status !== stripeSubscription.status) {
      await supabase
        .from("subscriptions")
        .update({ 
          status: stripeSubscription.status,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", subscriptionData.id);
    }

    // Update the user's premium status in their profile
    await updateUserPremiumStatus(user.id, isPremium);
    
    // Get the enhanced subscription data to return to the client
    const enhancedSubscription = {
      ...subscriptionData,
      cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      current_period_end: stripeSubscription.current_period_end,
      status: stripeSubscription.status
    };

    return new Response(
      JSON.stringify({ 
        isPremium, 
        subscription: enhancedSubscription
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return new Response(
      JSON.stringify({ isPremium: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function updateUserPremiumStatus(userId: string, isPremium: boolean) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ is_premium: isPremium })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user premium status:", error);
    }
  } catch (error) {
    console.error("Exception updating user premium status:", error);
  }
}
