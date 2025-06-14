'use client'; // Garante que é um Client Component

import React, { useEffect, useState } from 'react';
import {
    Check,
    Pencil,
    X,
    ToggleLeft,
    ToggleRight,
    Trash
} from 'lucide-react';

import { Link } from '../types/linkTypes';
import {
    updateLink, 
    deleteLink 
} from '../utils/profile';

import CharacterLimitedText from './CharacterLimitedText';


interface EditableLinkItemProps {
    link: Link;
    creatorLinks: Link[];
    setCreatorLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

const EditableLinkItem: React.FC<EditableLinkItemProps> = ({
    link,
    creatorLinks,
    setCreatorLinks
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableTitle, setEditableTitle] = useState(link.title);
    const [editableUrl, setEditableUrl] = useState(link.url);
    const [message, setMessage] = useState('');
    const [updating, setUpdating] = useState(false);
    const [isShow, setIsShow] = useState(link.show); 

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableTitle(e.target.value);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableUrl(e.target.value);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setMessage('');
        if (isEditing) {
            setEditableTitle(link.title);
            setEditableUrl(link.url);
        }
    };

    const handleEditConfirm = async () => {
        try {
            setUpdating(true);
            setMessage('Atualizando...');

            const success = await updateLink(link.id, {
                title: editableTitle,
                url: editableUrl
            });

            if (success) {
                const updatedLinks = creatorLinks.map(l =>
                    l.id === link.id ? { ...l, title: editableTitle, url: editableUrl } : l
                );
                setCreatorLinks(updatedLinks);
                setIsEditing(false);
                setMessage('Link atualizado!');
                setTimeout(() => setMessage(''), 2000);
            } else {
                setMessage('Erro ao atualizar.');
            }
        } catch (error) {
            console.error('Error updating link:', error);
            setMessage('Erro ao atualizar.');
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteLink = async () => {
        try {
            setUpdating(true);
            setMessage('Removendo...');
            const success = await deleteLink(link.id);
            if (success) {
                const updatedLinks = creatorLinks.filter(l => l.id !== link.id);
                setCreatorLinks(updatedLinks);
                setMessage('Link removido!');
                setTimeout(() => setMessage(''), 2000);
            } else {
                setMessage('Erro ao remover link.');
            }
        } catch (error) {
            console.error('Erro ao remover link:', error);
            setMessage('Erro ao remover link.');
        } finally {
            setUpdating(false);
        }
    };


    return (
        <div className="flex w-full items-center justify-between rounded-2xl border bg-white p-2 px-6 py-9 shadow">
            <div className="flex flex-col items-center w-full">
                <div className="flex basis-5/6 flex-col gap-2 w-full">
                    {message && (
                        <div className={`text-xs p-1 rounded mb-2 ${
                            message.includes('sucesso') || message.includes('atualizado') || message.includes('removido') ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {message}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editableTitle}
                                onChange={handleTitleChange}
                                className="w-full rounded-lg p-1 border"
                                disabled={updating}
                            />
                        ) : (
                            <h6>
                                <CharacterLimitedText
                                    text={editableTitle}
                                    limit={26}
                                />
                            </h6>
                        )}
                        {isEditing ? (
                            <div className="flex gap-2 pr-2">
                                <X
                                    className="w-4 cursor-pointer"
                                    onClick={handleEditToggle}
                                />
                                <Check
                                    className="w-4 cursor-pointer"
                                    onClick={handleEditConfirm}
                                />
                            </div>
                        ) : (
                            <Pencil 
                                className="w-4 cursor-pointer"
                                onClick={handleEditToggle}
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <small>
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={editableUrl}
                                    onChange={handleUrlChange}
                                    className="w-full rounded-lg p-1 border"
                                    placeholder="https://example.com"
                                    disabled={updating}
                                />
                            ) : (
                                <a
                                    href={editableUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline truncate"
                                >
                                    {editableUrl}
                                </a>
                            )}
                        </small>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
                <button onClick={handleDeleteLink} disabled={updating} className="p-1 rounded hover:bg-red-100 disabled:opacity-50">
                     <Trash className="w-4 h-4 text-red-500" />
                </button>
            </div>
        </div>
    );
};

export default EditableLinkItem;
