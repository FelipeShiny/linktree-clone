import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

export interface Profile {
    id: string;
    username: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    created_at?: string;
}

export interface Link {
    id: string;
    user_id: string;
    title: string;
    url: string;
    show: boolean;
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

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updateProfile:', error);
        return false;
    }
};

export const uploadProfilePicture = async (userId: string, file: File): Promise<string | null> => {
    try {
        // Upload da imagem para o Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}_avatar.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
                upsert: true
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return null;
        }

        // Obter a URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Erro no upload da foto de perfil:', error);
        return null;
    }
};

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

// CORRIGIDO: Estrutura do try...catch na função fetchLinks
export async function fetchLinks(userId: string): Promise<Link[]> {
    try {
        if (!userId) {
            console.error('fetchLinks: userId is required');
            return [];
        }

        const { data, error } = await supabase
            .from('links')
            .select('id, user_id, title, url, show, order_index, created_at')
            .eq('user_id', userId)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching links:', error.message || error);
            return [];
        }

        return data || []; // Retorno dentro do try
    } catch (error) { // Catch alinhado com o try
        console.error('Error in fetchLinks:', error);
        return [];
    }
}

export async function fetchCreatorData(username: string) {
    try {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, full_name, bio, avatar_url, created_at')
            .eq('username', username)
            .single();

        if (profileError || !profile) {
            console.error('Error fetching profile:', profileError);
            return null;
        }

        const { data: links, error: linksError } = await supabase
            .from('links')
            .select('id, user_id, title, url, show, order_index, created_at')
            .eq('user_id', profile.id)
            .eq('show', true)
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
    if (!avatarUrl || avatarUrl.trim() === '') {
        return '/assets/default-profile-picture.jpg';
    }

    // Se já é uma URL completa, retorna como está
    if (avatarUrl.startsWith('http')) {
        return avatarUrl;
    }

    // Construir URL manualmente para o Supabase Storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
        return `${supabaseUrl}/storage/v1/object/public/avatars/${avatarUrl}`;
    }

    // Fallback para imagem padrão se não conseguir construir URL
    return '/assets/default-profile-picture.jpg';
}

export async function updateLink(linkId: string, updates: { title: string; url: string }): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('links')
            .update(updates)
            .eq('id', linkId);

        if (error) {
            console.error('Error updating link:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updateLink:', error);
        return false;
    }
}

export async function deleteLink(linkId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', linkId);

        if (error) {
            console.error('Error deleting link:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteLink:', error);
        return false;
    }
}

export async function addNewLink(userId: string, title: string, url: string): Promise<Link | null> {
    try {
        // Get the current highest order_index for this user
        const { data: existingLinks, error: fetchError } = await supabase
            .from('links')
            .select('order_index')
            .eq('user_id', userId)
            .order('order_index', { ascending: false })
            .limit(1);

        if (fetchError) {
            console.error('Error fetching existing links:', fetchError);
            return null;
        }

        const nextOrderIndex = existingLinks && existingLinks.length > 0 
            ? (existingLinks[0].order_index || 0) + 1 
            : 0;

        const { data, error } = await supabase
            .from('links')
            .insert({
                user_id: userId,
                title: title,
                url: url,
                show: true,
                order_index: nextOrderIndex
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding new link:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in addNewLink:', error);
        return null;
    }
}