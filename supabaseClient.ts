
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://noumkgwcxuyyxmijuuvr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdW1rZ3djeHV5eXhtaWp1dXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjk4ODQsImV4cCI6MjA3ODYwNTg4NH0.u0rbl857PRL3aBMWX5t3tySqw6esg76ahEvbASI5-Jg';

export const supabase = createClient(supabaseUrl, supabaseKey);
