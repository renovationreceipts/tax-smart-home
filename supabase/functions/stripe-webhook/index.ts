
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1"
import Stripe from "https://esm.sh/stripe@11.1.0?target=deno"

// Supabase client setup
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
const supabase = createClient(supabaseUrl, supabaseKey)

// Stripe setup
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") ?? ""
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? ""
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
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    console.log(`Event received: ${event.type}`)

    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object)
        break

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error(`Webhook error: ${error.message}`)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

async function handleCheckoutSessionCompleted(session) {
  // Extract user ID from the session metadata
  const userId = session.client_reference_id || session.metadata?.user_id

  if (!userId) {
    console.error("No user ID found in checkout session")
    return
  }

  // Get the subscription details
  const subscription = await stripe.subscriptions.retrieve(session.subscription)

  // Update or create a record in the subscriptions table
  const { error } = await supabase
    .from("subscriptions")
    .upsert({
      user_id: userId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error("Error updating subscription:", error)
    return
  }

  // Update the is_premium flag in the profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ is_premium: true })
    .eq("id", userId)

  if (profileError) {
    console.error("Error updating profile premium status:", profileError)
  }
}

async function handleSubscriptionUpdated(subscription) {
  // Find the user by their Stripe customer ID
  const { data: subscriptionData, error: fetchError } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscription.id)
    .single()

  if (fetchError) {
    console.error("Error fetching subscription:", fetchError)
    return
  }

  if (!subscriptionData) {
    console.error("No subscription found with ID:", subscription.id)
    return
  }

  const userId = subscriptionData.user_id

  // Update the subscription record
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("stripe_subscription_id", subscription.id)

  if (error) {
    console.error("Error updating subscription:", error)
    return
  }

  // Update the is_premium flag based on subscription status
  const isPremium = subscription.status === "active" || subscription.status === "trialing"

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ is_premium: isPremium })
    .eq("id", userId)

  if (profileError) {
    console.error("Error updating profile premium status:", profileError)
  }
}

async function handleSubscriptionDeleted(subscription) {
  // Find the user by their Stripe customer ID
  const { data: subscriptionData, error: fetchError } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscription.id)
    .single()

  if (fetchError) {
    console.error("Error fetching subscription:", fetchError)
    return
  }

  if (!subscriptionData) {
    console.error("No subscription found with ID:", subscription.id)
    return
  }

  const userId = subscriptionData.user_id

  // Update the subscription record
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString()
    })
    .eq("stripe_subscription_id", subscription.id)

  if (error) {
    console.error("Error updating subscription:", error)
    return
  }

  // Update the is_premium flag in the profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ is_premium: false })
    .eq("id", userId)

  if (profileError) {
    console.error("Error updating profile premium status:", profileError)
  }
}
