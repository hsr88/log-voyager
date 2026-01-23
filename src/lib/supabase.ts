
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


    // ... existing getSnippet ...
    return data;
}

// --- PERSISTENT BOOKMARKS (PRO) ---

export interface RemoteBookmark {
    id: string;
    file_signature: string;
    line_number: number;
    chunk_offset: number;
    content: string;
    created_at: string;
}

export async function fetchRemoteBookmarks(fileSignature: string): Promise<RemoteBookmark[]> {
    const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('file_signature', fileSignature);

    if (error) {
        console.warn('Error fetching bookmarks:', error);
        return [];
    }
    return data || [];
}

export async function saveRemoteBookmark(fileSignature: string, lineNum: number, chunkOffset: number, content: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
        .from('bookmarks')
        .insert({
            user_id: user.id,
            file_signature: fileSignature,
            line_number: lineNum,
            chunk_offset: chunkOffset,
            content
        });

    if (error) console.error('Error saving bookmark:', error);
}

export async function deleteRemoteBookmark(fileSignature: string, lineNum: number): Promise<void> {
    const { error } = await supabase
        .from('bookmarks')
        .delete()
        .match({ file_signature: fileSignature, line_number: lineNum });

    if (error) console.error('Error deleting bookmark:', error);
}
