'use client';

import React, { useState, useEffect } from 'react';
import AuthStore from '../interfaces/AuthStore';
import { useRouter } from 'next/navigation';
import ProfilePicture from '../components/ProfilePicture';
import { fetchLinks, fetchProfilePicture } from '../utils/profile';
import { Link } from '../types/linkTypes';
import { Eye } from 'lucide-react';
import NextLink from 'next/link';
import EnterUrl from '../components/EnterUrl';
import EditableLinkItem from '../components/EditableLinkItem';
import { ChangeProfilePictureDialog } from '../components/ChangeProfilePictureDialog'; // <<<<< IMPORT ADICIONADO AQUI

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
    }, [router]);

    const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
    const [profilePicture, setProfilePicture] = useState<string>('');
    useEffect(() => {
        if (creatorId) {
            fetchLinks(creatorId, setCreatorLinks, setIsLinkLoading);
            fetchProfilePicture(creatorId, setProfilePicture);
        }
    }, [creatorId]);
    // DON'T ADD creatorLinks (infinite call)

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
                    setProfilePicture={setProfilePicture}
                    // router={router} // Removido router daqui se ProfilePicture não precisa dele diretamente
                />

                {/* <<<<< COMPONENTE DE UPLOAD DA FOTO ADICIONADO AQUI >>>>> */}
                <ChangeProfilePictureDialog
                    creatorId={creatorId}
                    router={router}
                    setProfilePicture={setProfilePicture}
                />
                {/* <<<<< FIM DO COMPONENTE DE UPLOAD DA FOTO >>>>> */}

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
                {creatorLinks.map((link: Link, index: number) => (
                    <EditableLinkItem key={index} link={link} />
                ))}
            </div>
        )
    );
};

export default Admin;