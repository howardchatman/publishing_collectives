import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client with service role — use only in server components / API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
