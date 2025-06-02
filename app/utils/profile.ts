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
        console.log('Error in creating new link: ', error);
    }
};

export const uploadProfilePicture = async (
    creatorId: string,
    file: File,
    router: any,
) => {
    try {
        const maxSizeMB = 5;
        const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert megabytes to bytes
        if (file.size > maxSizeBytes) {
            throw new Error(
                `File size exceeds the maximum limit of ${maxSizeMB} MB`,
            );
        }

        // Já está 'avatars'
        const { data: updateData, error: updateError } = await supabase.storage
            .from('avatars')
            .update(creatorId + '/avatar', file, { cacheControl: '3600' });

        if (updateError) {
            console.error(
                'Failed to update profile picture (first attempt):',
                updateError.message,
            );

            // Já está 'avatars'
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .update(creatorId + '/avatar', file);

            if (uploadError) {
                console.error(
                    'Failed to upload profile picture (second attempt):',
                    uploadError.message,
                );
            } else {
                console.log('File uploaded successfully:', uploadData);
                location.reload();
            }
        } else {
            console.log('Profile picture updated successfully:', updateData);
            location.reload();
        }
    } catch (error: any) { // Adicionado 'any' para o tipo de erro para compatibilidade
        console.error('Failed to upload profile picture (catch block):', error.message || error);
    }
};

export const fetchCreatorId = async (
    creatorSlug: string,
    setCreatorId: React.Dispatch<React.SetStateAction<string>>,
) => {
    try {
        // Fetch profile picture and creator ID
        // CORRIGIDO: Deve ser 'profiles' aqui, não 'avatars'
        const { data: profileData, error: profileError } = await supabase
            .from('profiles') // <-- CORRIGIDO: Era 'avatars', agora é 'profiles'
            .select('id')
            .eq('username', creatorSlug);
        if (profileError) throw profileError;

        const fetchedCreatorId = profileData[0]?.id;
        setCreatorId(fetchedCreatorId);
    } catch (error) {
        console.log('Error fetching profile data: ', error);
    }
};

export const fetchLinks = async (
    creatorId: string,
    setCreatorLinks: React.Dispatch<React.SetStateAction<Link[]>>,
    setIsLinkLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    try {
        // Fetch creator links using creatorId
        const { data: linksData, error: linksError } = await supabase
            .from('links')
            .select('id, title, url, show')
            .eq('user_id', creatorId);
        if (linksError) throw linksError;

        setCreatorLinks(linksData);
        setIsLinkLoading(false);
    } catch (error) {
        console.log('Error fetching links data: ', error);
        setIsLinkLoading(false);
    }
};

export const fetchProfilePicture = async (
    creatorId: string,
    setProfilePicture: React.Dispatch<React.SetStateAction<string>>,
) => {
    try {
        const { data: profilePictureData } = await supabase.storage
            .from('avatars') // Já está 'avatars', mantido
            .list(creatorId + '/', {
                limit: 1,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });
        if (!profilePictureData || profilePictureData.length === 0) {
            throw new Error('No profile picture data found.');
        }
        setProfilePicture(
            // **CORRIGIDO:** Removido o <span> e { } problemáticos, e garantido que a URL use a variável de ambiente.
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${creatorId}/avatar?nocache=${Date.now()}`,
        );
    } catch (error) {
        // console.log('Failed to fetch profile picture: ', error);
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
        console.log('error: ', error);
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
        console.log('error: ', error);
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
        console.log('Could not change state of show: ', error);
    }
};

export const deleteLink = async (linkId: number) => {
    try {
        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', linkId)
            .select();
        if (error) throw error;
    } catch (error) {
        console.log('error: ', error);
    }
};
