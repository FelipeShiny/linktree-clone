'use client';

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import {
    fetchCreatorId,
    fetchLinks,
    fetchCreatorData,
    getProfilePictureUrl,
} from '../utils/profile';
import ProfilePicture from '../components/ProfilePicture';
import CreatorLinks from '../components/CreatorLinks';
import { Link } from '../types/linkTypes';

const CreatorLinksPage = observer(
    ({ params }: { params: { creatorSlug: string } }) => {
        const [creatorId, setCreatorId] = useState<string>('');

        const { creatorSlug } = params;
        const [profilePicture, setProfilePicture] = useState<string>('');
        const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
        const [isLinkLoading, setIsLinkLoading] = useState<boolean>(true);

        useEffect(() => {
            if (creatorSlug) {
                const loadCreatorId = async () => {
                    const id = await fetchCreatorId(creatorSlug);
                    if (id) {
                        setCreatorId(id);
                    }
                };
                loadCreatorId();
            }
        }, [creatorSlug]);

        useEffect(() => {
            if (creatorId) {
                fetchLinks(creatorId, setCreatorLinks, setIsLinkLoading);
                // Generate profile picture URL using the new function
                const profilePictureUrl = getProfilePictureUrl(creatorId);
                setProfilePicture(profilePictureUrl);
            }
        }, [creatorId]);

        return (
            <div className="h-min-screen flex flex-col items-center justify-center gap-5 px-5 py-10">
                <ProfilePicture
                    creatorId={creatorId}
                    profilePicture={profilePicture}
                    setProfilePicture={setProfilePicture}
                />
                <h3>@{creatorSlug}</h3>
                <CreatorLinks
                    isLinkLoading={isLinkLoading}
                    creatorLinks={creatorLinks}
                />
            </div>
        );
    },
);

export default CreatorLinksPage;
