
'use client';

import React, { useState } from 'react';
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
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja excluir este link?')) {
            try {
                setDeleting(true);
                const success = await deleteLink(linkId);
                if (success) {
                    const updatedLinks = creatorLinks.filter(link => link.id !== linkId);
                    setCreatorLinks(updatedLinks);
                } else {
                    alert('Erro ao remover link.');
                }
            } catch (error) {
                console.error('Error deleting link:', error);
                alert('Erro ao remover link.');
            } finally {
                setDeleting(false);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
            title="Excluir link"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
};

export default DeleteLinkButton;
