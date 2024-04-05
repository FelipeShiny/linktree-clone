'use client';

import React, { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';
import Image from 'next/image';
import LinkDropDown from '../components/LinkDropDown';
import { observer } from 'mobx-react';
import AuthStore from '../interfaces/AuthStore';
import { useRouter } from 'next/navigation';
import {
    addNewLink,
    fetchCreatorId,
    fetchLinks,
    fetchProfilePicture,
    uploadProfilePicture,
} from '../utils/profile';

type Link = {
    id: number;
    title: string;
    url: string;
};

const CreatorLinksPage = observer(
    ({ params }: { params: { creatorSlug: string } }) => {
        const [isLinkOwner, setIsLinkOwner] = useState<boolean>(false);

        // Create
        const [newTitle, setNewTitle] = useState<string>('');
        const [newUrl, setNewUrl] = useState<string>('');
        const [creatorId, setCreatorId] = useState<string>('');

        useEffect(() => {
            if (
                AuthStore.authUserId &&
                creatorId &&
                AuthStore.authUserId === creatorId
            ) {
                setIsLinkOwner(true);
            }
        }, [creatorId]);

        // Upload Profile Picture
        const router = useRouter();

        // Read
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

        // Update

        // Delete
        return (
            <div className="h-min-screen flex flex-col items-center justify-center gap-5 px-5 py-10">
                {creatorId && profilePicture ? (
                    <div>
                        <Image
                            src={`https://dpehbxmmipfxwdjjmuog.supabase.co/storage/v1/object/public/profile_picture/${creatorId}/avatar?nocache=${Date.now()}`}
                            alt="profile_picture"
                            width={0}
                            height={0}
                            sizes={'1'}
                            className="h-48 w-48 rounded-full shadow-lg"
                            priority
                        />
                    </div>
                ) : (
                    <div>
                        <Image
                            src={'/assets/default-profile-picture.jpg'}
                            alt="profile_picture"
                            width={0}
                            height={0}
                            sizes={'1'}
                            className="h-48 w-48 rounded-full shadow-lg"
                            priority
                        />
                    </div>
                )}
                <h3>@{creatorSlug}</h3>
                <div className="flex w-full flex-col gap-3">
                    {isLinkLoading ? (
                        <h4 className="text-center">Loading...</h4>
                    ) : creatorLinks && creatorLinks.length > 0 ? (
                        creatorLinks.map((link: Link, index: number) => (
                            <div key={index}>
                                <button
                                    onClick={() =>
                                        window.open(
                                            link.url.startsWith('http')
                                                ? link.url
                                                : `https://${link.url}`,
                                            '_blank',
                                        )
                                    }
                                    rel="noopener noreferrer"
                                    className="flex h-16 items-center justify-center rounded-full bg-[#222222] p-2 text-white hover:opacity-80"
                                >
                                    <p>{link.title}</p>
                                </button>
                            </div>
                        ))
                    ) : (
                        <h5 className="text-center">
                            This creator does not have any links.
                        </h5>
                    )}
                </div>
                {isLinkOwner && (
                    <>
                        <div className="bg-grey-100 flex flex-col items-center gap-2 rounded-lg border p-2">
                            <div className="mt-1 flex gap-2">
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={newTitle || ''}
                                    className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                                    placeholder="Title"
                                    onChange={(e) =>
                                        setNewTitle(e.target.value)
                                    }
                                />
                                <input
                                    type="text"
                                    name="url"
                                    id="url"
                                    value={newUrl || ''}
                                    className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                                    placeholder="URL"
                                    onChange={(e) => setNewUrl(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                className="cursor rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-white"
                                onClick={() =>
                                    addNewLink(
                                        newTitle,
                                        newUrl,
                                        creatorLinks,
                                        setNewTitle,
                                        setNewUrl,
                                        setCreatorLinks,
                                    )
                                }
                            >
                                Add new link
                            </button>
                        </div>

                        <div>
                            <h2 className="pb-3 text-lg font-bold">
                                Upload Profile Picture
                                {creatorId}
                            </h2>
                            <input
                                type="file"
                                onChange={(e) => {
                                    const selectedFile =
                                        e.target.files && e.target.files[0];
                                    if (creatorId && selectedFile) {
                                        uploadProfilePicture(
                                            creatorId,
                                            selectedFile,
                                            router,
                                        );
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    },
);

export default CreatorLinksPage;
