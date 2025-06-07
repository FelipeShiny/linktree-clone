import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

export interface Profile {
    id: string;
    username: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Link {
    id: string;
    user_id: string;
    title: string;
    url: string;
    order_index?: number;
    created_at?: string;
}

export async function getUser(): Promise<User | null> {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error getting user:', error);
            return null;
        }
        return user;
    } catch (error) {
        console.error('Error in getUser:', error);
        return null;
    }
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getProfileByUserId:', error);
        return null;
    }
}

export async function updateProfile(userId: string, profileData: Partial<Profile>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', userId);

        if (error) {
            console.error('Error updating profile:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updateProfile:', error);
        return false;
    }
}

export async function fetchCreatorId(username: string): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single();

        if (error || !data) {
            console.error('Error fetching creator ID:', error);
            return null;
        }

        return data.id;
    } catch (error) {
        console.error('Error in fetchCreatorId:', error);
        return null;
    }
}

export async function fetchLinks(userId: string): Promise<Link[]> {
    try {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', userId)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching links:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in fetchLinks:', error);
        return [];
    }
}

export async function fetchCreatorData(username: string) {
    try {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (profileError || !profile) {
            console.error('Error fetching profile:', profileError);
            return null;
        }

        const { data: links, error: linksError } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', profile.id)
            .order('order_index', { ascending: true });

        if (linksError) {
            console.error('Error fetching links:', linksError);
            return { profile, links: [] };
        }

        return { profile, links: links || [] };
    } catch (error) {
        console.error('Error in fetchCreatorData:', error);
        return null;
    }
}

export function getProfilePictureUrl(avatarUrl?: string | null): string {
    if (!avatarUrl) {
        return '/assets/default-profile-picture.jpg';
    }

    // Se já é uma URL completa, retorna como está
    if (avatarUrl.startsWith('http')) {
        return avatarUrl;
    }

    // Se é um caminho relativo do Supabase Storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/avatars/${avatarUrl}`;
}