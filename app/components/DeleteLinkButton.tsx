'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { deleteLink } from '../utils/profile';
import { Link } from '../types/linkTypes';

interface DeleteLinkButtonProps {
    linkId: string;
    creatorLinks: Link[];
    setCreatorLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

const DeleteLinkButton: React.FC<DeleteLinkButtonProps> = ({ 
    linkId, 
    creatorLinks, 
    setCreatorLinks 
}) => {
    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja excluir este link?')) {
            try {
                const success = await deleteLink(linkId);
                if (success) {
                    const updatedLinks = creatorLinks.filter(link => link.id !== linkId);
                    setCreatorLinks(updatedLinks);
                }
            } catch (error) {
                console.error('Error deleting link:', error);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded"
            title="Excluir link"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
};

export default DeleteLinkButton;