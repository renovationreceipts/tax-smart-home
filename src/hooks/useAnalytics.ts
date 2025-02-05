import { useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

type EventType = "click" | "pageview" | "custom"

interface TrackEventOptions {
  eventName: string
  eventType?: EventType
  eventData?: Record<string, any>
  pageUrl?: string
  sessionId?: string
}

export function useAnalytics() {
  const { toast } = useToast()
  const userId = supabase.auth.getUser().then(response => response.data.user?.id)

  const trackEvent = useCallback(async ({
    eventName,
    eventType = "custom",
    eventData = {},
    pageUrl = window.location.href,
    sessionId
  }: TrackEventOptions) => {
    try {
      console.log("Tracking event:", { eventName, eventType, eventData, pageUrl })
      const user = await userId

      if (!user) {
        console.log("No user found, skipping analytics")
        return
      }

      const { error } = await supabase
        .from("analytics_events")
        .insert({
          user_id: user,
          event_type: eventType,
          event_name: eventName,
          event_data: eventData,
          page_url: pageUrl,
          session_id: sessionId
        })

      if (error) {
        console.error("Error tracking event:", error)
        toast({
          variant: "destructive",
          title: "Analytics Error",
          description: "Failed to track event. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error in trackEvent:", error)
    }
  }, [toast, userId])

  return { trackEvent }
}