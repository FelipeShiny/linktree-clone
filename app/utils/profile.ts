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
