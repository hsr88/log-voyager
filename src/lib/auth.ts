import { supabase } from './supabase';
import { authLog } from './auth-debug';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
    id: string;
    email: string;
    subscription_tier: 'free' | 'pro';
}

/**
 * Fetches the user profile from the database.
 * @param providedUser Optional user object to avoid redundant supabase.auth calls.
 */
export async function getUserProfile(providedUser?: User | null): Promise<UserProfile | null> {
    authLog('getUserProfile called', providedUser ? `(user provided: ${providedUser.email})` : '(no user provided)');

    try {
        let user = providedUser;

        // If no user provided, try to fetch it
        if (!user) {
            const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();
            user = fetchedUser;

            if (!user || userError) {
                if (userError && userError.name !== 'AbortError') {
                    authLog('auth.getUser() error', userError);
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                    user = session?.user ?? null;
                    if (sessionError) authLog('auth.getSession() error', sessionError);
                }
            }
        }

        if (!user) {
            authLog('No valid user found in session');
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
            return {
                id: user.id,
                email: user.email || '',
                subscription_tier: 'free'
            };
        }

        authLog('Successfully created new profile', newProfile);
        return newProfile as UserProfile;
    } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) {
            authLog('getUserProfile aborted silently');
            // We throw a custom shaped error that the UI can recognize as "don't logout"
            const abort = new Error('Auth fetch aborted');
            abort.name = 'AbortError';
            throw abort;
        }
        authLog('Unexpected error in getUserProfile', err);
        return null;
    }
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

export async function signOut() {
    return await supabase.auth.signOut();
}
