import React, { useState } from 'react';
import supabase from '../utils/supabaseClient';
import { Link } from '../types/linkTypes';

const Admin = () => {
    // Delete
    const deleteLink = async (linkId: number) => {
        const [isLinkOwner, setIsLinkOwner] = useState<boolean>(false);
        const [creatorLinks, setCreatorLinks] = useState<Link[]>();

        try {
            const { error } = await supabase
                .from('links')
                .delete()
                .eq('id', linkId)
                .select();
            if (error) throw error;

            if (creatorLinks) {
                const updatedLinks = creatorLinks.filter(
                    (link) => link.id !== linkId,
                );
                setCreatorLinks(updatedLinks);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };
    return <div>Admin</div>;
};

export default Admin;
