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

    // Profile doesn't exist yet - create it (fallback if trigger didn't fire)
    console.log('Profile not found, creating one...');
    const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            email: user.email || '',
            subscription_tier: 'free'
        })
        .select()
        .single();

    if (insertError) {
        console.error('Error creating profile:', insertError);
        // Return fallback profile even if insert fails
        return {
            id: user.id,
            email: user.email || '',
            subscription_tier: 'free'
        };
    }

    return newProfile as UserProfile;
}

const getRedirectURL = () => {
    return import.meta.env.VITE_PUBLIC_URL || window.location.origin;
};

export async function signInWithMagicLink(email: string) {
    return await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: getRedirectURL()
        }
    });
}

export async function signInWithGithub() {
    return await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: getRedirectURL()
        }
    });
}

export async function signInWithGoogle() {
    return await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: getRedirectURL()
        }
    });
}

export async function signOut() {
    return await supabase.auth.signOut();
}
