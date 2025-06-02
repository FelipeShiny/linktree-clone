// app/utils/profile.ts

import AuthStore from '../interfaces/AuthStore';
import { Link } from '../types/linkTypes';
import supabase from './supabaseClient'; // Garanta que esta importação esteja presente e correta.

export const addNewLink = async (
    newTitle: string,
    newUrl: string,
    creatorLinks: Link[],
    setNewTitle: React.Dispatch<React.SetStateAction<string>>,
    setNewUrl: React.Dispatch<React.SetStateAction<string>>,
    setCreatorLinks: React.Dispatch<React.SetStateAction<Link[]>>,
) => {
    try {
        if (
            newTitle.trim() !== '' &&
            newUrl.trim() !== '' &&
            AuthStore.authUserId
        ) {
            const { data, error } = await supabase
                .from('links')
                .insert({
                    title: newTitle,
                    url: newUrl,
                    user_id: AuthStore.authUserId,
                })
                .select();
            if (error)
                throw new Error(`Error inserting link: ${error.message}`);
            console.log('New link successfully created: ', data);
            if (creatorLinks) {
                setCreatorLinks([...creatorLinks, ...data]);
            }
            setNewTitle('');
            setNewUrl('');
        } else {
            throw new Error('Title, URL, or user ID is missing or invalid.');
        }
    } catch (error) {
        console.error('Error in creating new link: ', error); // Alterado para console.error
    }
};

export const uploadProfilePicture = async (
    creatorId: string,
    file: File,
    router: any, // router ainda é passado, mas não será usado diretamente aqui para refresh
) => {
    try {
        // Primeiro, fazer upload do arquivo para o bucket 'avatars'
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(`${creatorId}/avatar`, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (uploadError) {
            console.error('Failed to upload profile picture:', uploadError.message);
            return;
        }

        console.log('Profile picture uploaded successfully:', uploadData);

        // Depois, atualizar a URL na tabela profiles
        const profilePictureUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${creatorId}/avatar`;

        const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            // >>>>> LINHA CORRIGIDA AQUI: profile_picture_url para avatar_url <<<<<
            .update({ avatar_url: profilePictureUrl }) // <<<<<<< AQUI!
            .eq('id', creatorId);

        if (updateError) {
            console.error('Failed to update profile picture URL:', updateError.message);
            return;
        }

        console.log('Profile picture URL updated successfully:', updateData);

        // Recarregar a página para garantir que a nova imagem seja exibida
        // Use window.location.reload() ou um callback para o componente pai
        // router.refresh() é mais adequado para Server Components em alguns casos.
        window.location.reload(); // Recarrega a página inteira no navegador
    } catch (error) {
        console.error('Error in uploadProfilePicture:', error);
    }
};

export const fetchCreatorId = async (creatorSlug: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', creatorSlug)
            .single();

        if (error) {
            console.error('Error fetching creator ID:', error.message);
            return null;
        }

        return data?.id || null;
    } catch (error) {
        console.error('Error in fetchCreatorId:', error);
        return null;
    }
};

export const fetchCreatorData = async (creatorSlug: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', creatorSlug)
            .single();

        if (error) {
            console.error('Error fetching creator data:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in fetchCreatorData:', error);
        return null;
    }
};

export const getProfilePictureUrl = (creatorId: string) => {
    if (!creatorId) return '/assets/default-profile-picture.jpg';

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${creatorId}/avatar?nocache=${Date.now()}`;
};

export const fetchLinks = async (
    creatorId: string,
    setCreatorLinks: React.Dispatch<React.SetStateAction<Link[]>>,
    setIsLinkLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    try {
        setIsLinkLoading(true); // Definir como loading antes da busca
        const { data: linksData, error: linksError } = await supabase
            .from('links')
            .select('id, title, url, show')
            .eq('user_id', creatorId); // Garante que busca links do criador correto

        if (linksError) throw linksError;

        setCreatorLinks(linksData);
        setIsLinkLoading(false);
    } catch (error) {
        console.error('Error fetching links data: ', error); // Alterado para console.error
        setCreatorLinks([]); // Limpar links em caso de erro
        setIsLinkLoading(false);
    }
};

export const fetchProfilePicture = async (
    creatorId: string,
    setProfilePicture: React.Dispatch<React.SetStateAction<string>>,
) => {
    try {
        const { data: profilePictureData } = await supabase.storage
            .from('avatars')
            .list(creatorId + '/', {
                limit: 1,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });
        if (!profilePictureData || profilePictureData.length === 0) {
            throw new Error('No profile picture data found.');
        }
        setProfilePicture(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${creatorId}/avatar?nocache=${Date.now()}`,
        );
    } catch (error) {
        console.error('Failed to fetch profile picture: ', error);
        setProfilePicture('/assets/default-profile-picture.jpg'); // Fallback em caso de erro de fetch
    }
};

export const updateLinkTitle = async (linkId: number, newTitle: string) => {
    try {
        const { error } = await supabase
            .from('links')
            .update({ title: newTitle })
            .eq('id', linkId);
        if (error) throw error;
    } catch (error) {
        console.error('error updating link title: ', error); // Alterado para console.error
    }
};

export const updateLinkUrl = async (urlId: number, newUrl: string) => {
    try {
        const { error } = await supabase
            .from('links')
            .update({ url: newUrl })
            .eq('id', urlId);
        if (error) throw error;
    } catch (error) {
        console.error('error updating link URL: ', error); // Alterado para console.error
    }
};

export const updateShowLink = async (linkId: number) => {
    try {
        const { data: linkData, error: fetchError } = await supabase
            .from('links')
            .select('show')
            .eq('id', linkId)
            .single();

        if (fetchError) {
            throw fetchError;
        }

        const currentShowValue = linkData?.show;

        const { error: updateError } = await supabase
            .from('links')
            .update({ show: !currentShowValue })
            .eq('id', linkId);

        if (updateError) {
            throw updateError;
        }

        console.log('Show state of link updated successfully.');
    } catch (error) {
        console.error('Could not change state of show: ', error); // Alterado para console.error
    }
};

export const deleteLink = async (linkId: number) => {
    try {
        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', linkId)
            .select(); // .select() pode não ser necessário aqui se você só quer deletar
        if (error) throw error;
        console.log('Link deleted successfully.');
        window.location.reload(); // Recarregar a página para atualizar a lista de links
    } catch (error) {
        console.error('Error deleting link: ', error); // Alterado para console.error
    }
};