// profilePicture.ts
import supabase from './supabaseClient';

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
