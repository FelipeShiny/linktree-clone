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

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
};

export const uploadProfilePicture = async (userId: string, file: File) => {
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
      throw uploadError;
    }

    // Obter a URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Atualizar o perfil com a nova URL da imagem
    const { data: profileData, error: profileError } = await updateProfile(userId, {
      avatar_url: publicUrl
    });

    if (profileError) {
      throw profileError;
    }

    return { 
      data: { uploadData, profileData, publicUrl }, 
      error: null 
    };
  } catch (error) {
    console.error('Erro no upload da foto de perfil:', error);
    return { 
      data: null, 
      error: error 
    };
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