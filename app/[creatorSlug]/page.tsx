'use client';

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import {
    fetchCreatorId,
    fetchLinks,
    fetchProfilePicture,
} from '../utils/profile';
import ProfilePicture from '../components/ProfilePicture';
import CreatorLinks from '../components/CreatorLinks';

type Link = {
    id: number;
    title: string;
    url: string;
};

const CreatorLinksPage = observer(
    ({ params }: { params: { creatorSlug: string } }) => {
        const [creatorId, setCreatorId] = useState<string>('');

        const { creatorSlug } = params;
        const [profilePicture, setProfilePicture] = useState<boolean>(false);
        const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
        const [isLinkLoading, setIsLinkLoading] = useState<boolean>(true);

        useEffect(() => {
            if (creatorSlug) {
                fetchCreatorId(creatorSlug, setCreatorId);
            }
        }, [creatorSlug]);

        useEffect(() => {
            if (creatorId) {
                fetchLinks(creatorId, setCreatorLinks, setIsLinkLoading);
                fetchProfilePicture(creatorId, setProfilePicture);
            }
        }, [creatorId]);

        return (
            <div className="h-min-screen flex flex-col items-center justify-center gap-5 px-5 py-10">
                <ProfilePicture
                    creatorId={creatorId}
                    profilePicture={profilePicture}
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
