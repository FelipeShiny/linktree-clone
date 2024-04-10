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
import EditableLinkItem from '../components/EditableLinkItem';

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
                {creatorLinks
                    .filter((link: Link) => link.show === true)
                    .map((link: Link, index: number) => (
                        <EditableLinkItem key={index} link={link} />
                    ))}

                {/* <CreatorLinks
                    isLinkLoading={isLinkLoading}
                    creatorLinks={creatorLinks}
                /> */}
            </div>
        )
    );
};

export default Admin;
