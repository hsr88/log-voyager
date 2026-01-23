
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'logvoyager-sb-auth'
    }
});

export interface LogSnippet {
    id?: string;
    content: string;
    filename: string;
    created_at?: string;
    metadata?: any;
}

/**
 * Uploads a log snippet to Supabase.
 * Returns the ID of the inserted row or null if failed.
 */
export async function uploadSnippet(snippet: LogSnippet): Promise<string | null> {
    const { data, error } = await supabase
        .from('snippets')
        .insert([snippet])
        .select()
        .single();

    if (error) {
        console.error('Error uploading snippet:', error);
        return null;
    }

    return data.id;
}

/**
 * Fetches a snippet by ID.
 */
export async function getSnippet(id: string): Promise<LogSnippet | null> {
    const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching snippet:', error);
        return null;
    }

    return data;
}
