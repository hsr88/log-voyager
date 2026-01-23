import { supabase } from './supabase';
import { authLog } from './auth-debug';

export interface UserProfile {
    id: string;
    email: string;
    subscription_tier: 'free' | 'pro';
}

export async function getUserProfile(): Promise<UserProfile | null> {
    authLog('getUserProfile called');

    // First try to get the current user session
    let { data: { user }, error: userError } = await supabase.auth.getUser();

    // If getUser fails, try getSession as a backup (sometimes more reliable during initialization)
    if (!user || userError) {
        authLog('auth.getUser() returned no user or error, trying getSession()', userError);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        user = session?.user ?? null;
        if (sessionError) authLog('auth.getSession() error', sessionError);
    }

    if (!user) {
        authLog('No valid user found in Supabase auth');
        return null;
    }

    authLog(`Checking profile in DB for user: ${user.email} (${user.id})`);

    // Fetch profile from 'profiles' table
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') {
        authLog('Error fetching profile from database', error);
        // Fallback to basic profile if DB fails but user is authenticated
        return {
            id: user.id,
            email: user.email || '',
            subscription_tier: 'free'
        };
    }

    if (data) {
        authLog('Profile found in database', data);
        return data as UserProfile;
    }

    // Profile doesn't exist yet - create it (fallback if trigger didn't fire)
    authLog('Profile not found in DB, attempting to create one...');
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
        authLog('Error creating profile in database', insertError);
        // Return fallback profile even if insert fails, so the user stays logged in
        return {
            id: user.id,
            email: user.email || '',
            subscription_tier: 'free'
        };
    }

    authLog('Successfully created new profile', newProfile);
    return newProfile as UserProfile;
}

const getRedirectURL = () => {
    const url = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
    authLog(`Auth redirect URL: ${url}`);
    return url;
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
