const supabaseClient_js = { name: "supabaseClient.js", type: "file", content: `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mnulygffzalvugqetksf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udWx5Z2ZmemFsdnVncWV0a3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3OTY4OTYsImV4cCI6MjA2NTM3Mjg5Nn0.uY_yHF9NlPXh2btbYf9s6MpDceXBVmyJmEU_sQvmqAk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
` };
const utils_js = { name: "utils.js", type: "file", content: `import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
` };

export const libFolder = {
    name: "lib",
    type: "folder",
    children: [
        supabaseClient_js,
        utils_js
    ]
};