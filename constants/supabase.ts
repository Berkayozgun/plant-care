import { createClient } from '@supabase/supabase-js';

// demo proje olduğu için url ve anon key'i saklamadım
export const SUPABASE_URL = 'https://afqxpeyafpcgawcwoqup.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcXhwZXlhZnBjZ2F3Y3dvcXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzODYxNDIsImV4cCI6MjA2ODk2MjE0Mn0.ST3Dxgq6zfTDG2NO3Toqp6sCOT29XJJSWzPoP6w6Lfw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 