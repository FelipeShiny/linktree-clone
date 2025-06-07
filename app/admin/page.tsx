'use client';

import React, { useState, useEffect } from 'react';
import AuthStore from '../interfaces/AuthStore';
import { useRouter } from 'next/navigation';
import ProfilePicture from '../components/ProfilePicture';
import { fetchLinks, getProfilePictureUrl } from '../utils/profile';
import { Link } from '../types/linkTypes';
import { Eye } from 'lucide-react';
import NextLink from 'next/link';
import EnterUrl from '../components/EnterUrl';
import EditableLinkItem from '../components/EditableLinkItem';
import { ChangeProfilePictureDialog } from '../components/ChangeProfilePictureDialog';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [creatorId, setCreatorId] = useState<string>('');
    const [creatorUsername, setCreatorUsername] = useState<string | undefined>(
        '',
    );

    // Adicionado: Estados para o novo link (URL e Título)
    const [newUrl, setNewUrl] = useState<string>('');
    const [newTitle, setNewTitle] = useState<string>('');

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
    }, [router]);

    const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
    const [profilePicture, setProfilePicture] = useState<string>('');
    const [isLinkLoading, setIsLinkLoading] = useState<boolean>(false);

    useEffect(() => {
        if (creatorId) {
            fetchLinks(creatorId, setCreatorLinks, setIsLinkLoading);
            const url = getProfilePictureUrl(creatorId);
            setProfilePicture(url);
        }
    }, [creatorId, setIsLinkLoading, setProfilePicture]);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <NextLink
                    href={`/${creatorUsername || creatorId}`}
                    className="flex items-center text-blue-600 hover:underline"
                >
                    <Eye className="h-5 w-5 mr-1" /> View Public Page
                </NextLink>
            </header>

            <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                <div className="flex items-center space-x-4">
                    <ProfilePicture 
                        creatorId={creatorId} 
                        profilePicture={profilePicture}
                        setProfilePicture={setProfilePicture}
                        router={router}
                    />
                    <div>
                        <p className="text-lg font-medium">@{creatorUsername || creatorId}</p>
                    </div>
                </div>
            </section>

            <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Links</h2>
                <EnterUrl
                    newUrl={newUrl} // Adicionado
                    setNewUrl={setNewUrl} // Adicionado
                    newTitle={newTitle} // Adicionado
                    setNewTitle={setNewTitle} // Adicionado
                    creatorLinks={creatorLinks}
                    setCreatorLinks={setCreatorLinks}
                />
                {isLinkLoading ? (
                    <p className="text-center text-gray-500">Loading links...</p>
                ) : creatorLinks.length === 0 ? (
                    <p className="text-center text-gray-500">No links added yet.</p>
                ) : (
                    <div className="space-y-4 mt-4">
                        {creatorLinks.map((link) => (
                            <EditableLinkItem
                                key={link.id}
                                link={link}
                                creatorLinks={creatorLinks}
                                setCreatorLinks={setCreatorLinks}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Admin;