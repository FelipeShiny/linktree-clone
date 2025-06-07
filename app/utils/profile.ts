import supabase from './supabaseClient';
import { Link } from '../types/linkTypes';

export interface Profile {
    id: string;
    user_id: string;
    username: string;
    full_name: string;
    bio: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
}

export const getUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const fetchCreatorData = async (username: string) => {
    try {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (profileError) throw profileError;

        const { data: links, error: linksError } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', profile.user_id)
            .order('created_at', { ascending: true });

        if (linksError) throw linksError;

        return { profile, links };
    } catch (error) {
        console.error('Error fetching creator data:', error);
        return null;
    }
};

export const addNewLink = async (userId: string, title: string, url: string): Promise<Link | null> => {
    try {
        const { data, error } = await supabase
            .from('links')
            .insert({
                user_id: userId,
                title,
                url
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding new link:', error);
        return null;
    }
};

export const updateLink = async (linkId: string, updates: { title?: string; url?: string }) => {
    try {
        const { data, error } = await supabase
            .from('links')
            .update(updates)
            .eq('id', linkId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating link:', error);
        return null;
    }
};

export const deleteLink = async (linkId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', linkId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting link:', error);
        return false;
    }
};

export const uploadProfilePicture = async (userId: string, file: File): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return null;
    }
};