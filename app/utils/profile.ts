import AuthStore from '../interfaces/AuthStore';
import { Link } from '../types/linkTypes';
import supabase from './supabaseClient';

export const addNewLink = async (
    newTitle: string,
    newUrl: string,
    creatorLinks: Link[],
    setNewTitle: React.Dispatch<React.SetStateAction<string>>,
    setNewUrl: React.Dispatch<React.SetStateAction<string>>,
    setCreatorLinks: React.Dispatch<React.SetStateAction<Link[]>>,
) => {
    try {
        if (newTitle && newUrl && AuthStore.authUserId) {
            const { data, error } = await supabase
                .from('links')
                .insert({
                    title: newTitle,
                    url: newUrl,
                    user_id: AuthStore.authUserId,
                })
                .select();
            if (error) throw error;
            console.log('New link successfully created: ', data);
            if (creatorLinks) {
                setCreatorLinks([...data, ...creatorLinks]);
            }
            setNewTitle('');
            setNewUrl('');
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
        const { data, error } = await supabase.storage
            .from('profile_picture')
            .update(creatorId + '/' + 'avatar', file, {
                cacheControl: '3600',
            });
        if (error) {
            console.error('cant update');
            const { data, error } = await supabase.storage
                .from('profile_picture')
                .upload(creatorId + '/' + 'avatar', file);
            if (error) {
                console.error(error);
            } else {
                console.log('File uploaded successfully:', data);
                router.refresh();
            }
        } else {
            console.log('File uploaded successfully:', data);
            router.refresh();
        }
    } catch (error) {
        console.error('uuuuu', error);
    }
};

export const fetchCreatorId = async (
    creatorSlug: string,
    setCreatorId: React.Dispatch<React.SetStateAction<string>>,
) => {
    try {
        // Fetch profile picture and creator ID
        const { data: profileData, error: profileError } = await supabase
            .from('users')
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
    setProfilePicture: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    try {
        const { data: profilePictureData } = await supabase.storage
            .from('profile_picture')
            .list(creatorId + '/', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

        if (profilePictureData) {
            setProfilePicture(true);
        }
    } catch (error) {
        // Handle errors here
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
