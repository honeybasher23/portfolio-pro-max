import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://dvfqlldetkthxfjmobtb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZnFsbGRldGt0aHhmam1vYnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MzEzNzAsImV4cCI6MjEwNjMwNzM3MH0.pteTCaPCgVdKa56a5NL4i9aT3mwSm0x7iORgTfRgaGw';

export const supabase = createClient(supabaseUrl, supabaseKey);