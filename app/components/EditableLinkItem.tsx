'use client';

import React, { useState } from 'react';
import { Check, X, Pencil, Trash2 } from 'lucide-react';
import { Link } from '../types/linkTypes';
import { updateLink } from '../utils/profile';
import DeleteLinkButton from './DeleteLinkButton';
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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableTitle(e.target.value);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableUrl(e.target.value);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        // Reset to original values if canceling
        if (isEditing) {
            setEditableTitle(link.title);
            setEditableUrl(link.url);
        }
    };

    const handleEditConfirm = async () => {
        try {
            const updatedLink = await updateLink(link.id, {
                title: editableTitle,
                url: editableUrl
            });

            if (updatedLink) {
                // Update the local state
                const updatedLinks = creatorLinks.map(l => 
                    l.id === link.id ? { ...l, title: editableTitle, url: editableUrl } : l
                );
                setCreatorLinks(updatedLinks);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating link:', error);
        }
    };

    return (
        <div className="flex w-full items-center justify-between rounded-2xl border bg-white p-2 px-6 py-9 shadow">
            <div className="flex flex-col items-center">
                <div className="flex basis-5/6 flex-col gap-2">
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editableTitle}
                                onChange={handleTitleChange}
                                className="w-full rounded-lg p-1 border"
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
                        {isEditing ? (
                            <input
                                type="url"
                                value={editableUrl}
                                onChange={handleUrlChange}
                                className="w-full rounded-lg p-1 border"
                                placeholder="https://example.com"
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
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <DeleteLinkButton 
                    linkId={link.id}
                    creatorLinks={creatorLinks}
                    setCreatorLinks={setCreatorLinks}
                />
            </div>
        </div>
    );
};

export default EditableLinkItem;