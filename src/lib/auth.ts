import { supabase } from './supabase';

export interface UserProfile {
    id: string;
    email: string;
    subscription_tier: 'free' | 'pro';
}

export async function getUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch profile from 'profiles' table
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null; // Return null on error
    }

    if (data) {
        return data as UserProfile;
    }

    // Fallback if profile row doesn't exist yet (should be created by trigger, but just in case)
    return {
        id: user.id,
        email: user.email || '',
        subscription_tier: 'free' // Default to free
    };
}

export async function signInWithGithub() {
    return await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: window.location.origin
        }
    });
}

export async function signInWithGoogle() {
    return await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
}

export async function signOut() {
    return await supabase.auth.signOut();
}
