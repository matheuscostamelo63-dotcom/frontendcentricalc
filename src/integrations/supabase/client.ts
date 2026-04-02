import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mlabsszxdvhdiwxzdqms.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sYWJzc3p4ZHZoZGl3eHpkcW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Mzg3NTksImV4cCI6MjA4MjUxNDc1OX0.clM33KMSa2O2rMjd4criJcUZplcLY2PdAh-gaRvSyiE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
