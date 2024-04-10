import React, { useEffect, useState } from 'react';
import {
    Check,
    GripVertical,
    Pencil,
    ToggleLeft,
    ToggleRight,
    X,
} from 'lucide-react';
import { Link } from '../types/linkTypes';
import { updateLinkTitle } from '../utils/profile';
import { DeleteLinkButton } from './DeleteLinkButton';

const EditableLinkItem = ({ link }: { link: Link }) => {
    const [preSubmittedTitle, setPreSubmittedTitle] = useState(link.title);
    const [editableTitle, setEditableTitle] = useState(link.title);
    const [isEditing, setIsEditing] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableTitle(e.target.value);
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setEditableTitle(preSubmittedTitle);
        } else {
            setPreSubmittedTitle(editableTitle);
        }
        setIsEditing(!isEditing);
    };

    const handleEditConfirm = () => {
        setIsEditing(false);
        setPreSubmittedTitle(editableTitle);
        updateLinkTitle(link.id, editableTitle);
    };

    const CharacterLimitedText = ({
        text,
        limit,
    }: {
        text: string;
        limit: number;
    }) => {
        const [truncatedText, setTruncatedText] = useState(text);

        useEffect(() => {
            if (text.length > limit) {
                setTruncatedText(text.slice(0, limit) + '...');
            } else {
                setTruncatedText(text);
            }
        }, [text, limit]);

        return truncatedText;
    };

    return (
        <div className="flex w-full items-center justify-between rounded-2xl border bg-white p-2 px-6 py-9 shadow">
            <div className="flex items-center gap-4">
                <GripVertical />
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editableTitle}
                                onChange={handleTitleChange}
                                className="w-full rounded-lg p-1"
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
                                <X className="w-4" onClick={handleEditToggle} />
                                <Check
                                    className="w-4"
                                    onClick={handleEditConfirm}
                                />
                            </div>
                        ) : (
                            <Pencil
                                className="w-4"
                                onClick={handleEditToggle}
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <small>
                            <CharacterLimitedText text={link.url} limit={30} />
                        </small>
                        <Pencil className="w-4" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                {link.show ? <ToggleRight /> : <ToggleLeft />}
                <DeleteLinkButton linkId={link.id} />
            </div>
        </div>
    );
};

export default EditableLinkItem;
