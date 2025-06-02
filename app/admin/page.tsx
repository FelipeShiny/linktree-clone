'use client';

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import AuthStore from '../interfaces/AuthStore';
import { useRouter } from 'next/navigation';
import ProfilePicture from '../components/ProfilePicture';
import ChangeProfilePictureDialog from '../components/ChangeProfilePictureDialog';
import EditableLinkItem from '../components/EditableLinkItem';
import EnterUrl from '../components/EnterUrl';
import { fetchLinks, fetchProfilePicture } from '../utils/profile';
import { Link } from '../types/linkTypes';

const Admin = observer(() => {
    const router = useRouter();
    const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
    const [profilePicture, setProfilePicture] = useState<string>('');
    const [isLinkLoading, setIsLinkLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!AuthStore.isAuthenticated) {
            router.push('/login');
            return;
        }

        if (AuthStore.authUserId) {
            fetchLinks(AuthStore.authUserId, setCreatorLinks, setIsLinkLoading);
            fetchProfilePicture(AuthStore.authUserId, setProfilePicture);
        }
    }, [router]);

    if (!AuthStore.isAuthenticated) {
        return <div>Redirecionando...</div>;
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-5 px-5 py-10">
            <div className="relative">
                <ProfilePicture
                    creatorId={AuthStore.authUserId || ''}
                    profilePicture={profilePicture}
                    username={AuthStore.authUsername}
                    size={96}
                />
                <div className="absolute -bottom-2 -right-2">
                    <ChangeProfilePictureDialog 
                        setProfilePicture={setProfilePicture}
                    />
                </div>
            </div>

            <h1 className="text-2xl font-bold">@{AuthStore.authUsername}</h1>

            <div className="w-full max-w-md">
                <EnterUrl
                    creatorLinks={creatorLinks}
                    setCreatorLinks={setCreatorLinks}
                />
            </div>

            <div className="w-full max-w-md space-y-4">
                {isLinkLoading ? (
                    <div>Carregando links...</div>
                ) : (
                    creatorLinks.map((link) => (
                        <EditableLinkItem
                            key={link.id}
                            link={link}
                            creatorLinks={creatorLinks}
                            setCreatorLinks={setCreatorLinks}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

export default Admin;