// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gbztiauhydgyzvskqtrk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdienRpYXVoeWRneXp2c2txdHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MjYyOTcsImV4cCI6MjA1NDEwMjI5N30.Hh7N42ADxnVQWLfjn6mo_l9H11uOdgfiAk3j6zSaSX8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);