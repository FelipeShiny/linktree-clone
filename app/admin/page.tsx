'use client';

import React, { useState, useEffect } from 'react';
import AuthStore from '../interfaces/AuthStore';
import { useRouter } from 'next/navigation';
import ProfilePicture from '../components/ProfilePicture';
import CreatorLinks from '../components/CreatorLinks';
import {
    addNewLink,
    fetchCreatorId,
    fetchLinks,
    fetchProfilePicture,
    uploadProfilePicture,
} from '../utils/profile';
import { Link } from '../types/linkTypes';
import { Eye, GripVertical, Pencil, ToggleLeft, Trash } from 'lucide-react';
import NextLink from 'next/link';
import EnterUrl from '../components/EnterUrl';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [creatorId, setCreatorId] = useState<string>('');
    const [creatorUsername, setCreatorUsername] = useState<string | undefined>(
        '',
    );

    // check authentication
    const router = useRouter();

    useEffect(() => {
        if (AuthStore.authUserId) {
            setIsAuthenticated(true);
            setCreatorId(AuthStore.authUserId);
            setCreatorUsername(AuthStore.authUsername);
        } else {
            router.push('/login');
        }
    }, []);

    // Fetch links and profile picture
    useEffect(() => {
        if (creatorId) {
            fetchLinks(creatorId, setCreatorLinks, setIsLinkLoading);
            fetchProfilePicture(creatorId, setProfilePicture);
        }
    }, [creatorId]);

    // Upload Profile Picture
    const [profilePicture, setProfilePicture] = useState<boolean>(false);
    const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
    const [isLinkLoading, setIsLinkLoading] = useState<boolean>(true);

    // Create
    const [newTitle, setNewTitle] = useState<string>('');
    const [newUrl, setNewUrl] = useState<string>('');

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
        isAuthenticated && (
            <div className="h-min-screen flex flex-col items-center justify-center gap-5 px-5 py-10">
                <ProfilePicture
                    creatorId={creatorId}
                    profilePicture={profilePicture}
                    router={router}
                />

                <h3>@{creatorUsername}</h3>
                <NextLink href={`/${creatorUsername}`}>
                    <button className="flex w-48 gap-2 bg-[#222222]">
                        <Eye className="text-white" />
                        <p>View Profile</p>
                    </button>
                </NextLink>
                {isAuthenticated && (
                    <EnterUrl
                        newUrl={newUrl}
                        setNewUrl={setNewUrl}
                        newTitle={newTitle}
                        setNewTitle={setNewTitle}
                        creatorLinks={creatorLinks}
                        setCreatorLinks={setCreatorLinks}
                    />
                )}
                <div className="flex w-full items-center justify-between gap-6 rounded-2xl border bg-white p-2 px-6 py-9 shadow">
                    <GripVertical />
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <h6>
                                <CharacterLimitedText
                                    text="Instagram"
                                    limit={26}
                                />
                            </h6>
                            <Pencil className="w-4" />
                        </div>
                        <div className="flex items-center gap-2">
                            <small>
                                <CharacterLimitedText
                                    text="https://www.instagram.com/emokoooooooooooooooo"
                                    limit={30}
                                />
                            </small>
                            <Pencil className="w-4" />
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <ToggleLeft />
                        <Trash className="w-4" />
                    </div>
                </div>
                {/* <CreatorLinks
                    isLinkLoading={isLinkLoading}
                    creatorLinks={creatorLinks}
                /> */}
            </div>
        )
    );
};

export default Admin;
