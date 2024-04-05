'use client';

import React, { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';
import Image from 'next/image';
import LinkDropDown from '../components/LinkDropDown';
import { observer } from 'mobx-react';
import AuthStore from '../interfaces/AuthStore';
import { useRouter } from 'next/navigation';

type Link = {
    id: number;
    title: string;
    url: string;
};

const CreatorLinksPage = observer(
    ({ params }: { params: { creatorSlug: string } }) => {
        const [isLinkOwner, setIsLinkOwner] = useState<boolean>(false);

        // CRUD

        // Create
        const [newTitle, setNewTitle] = useState<string | undefined>();
        const [newUrl, setNewUrl] = useState<string | undefined>();
        const [creatorId, setCreatorId] = useState<string | undefined>();

        useEffect(() => {
            if (
                AuthStore.authUserId &&
                creatorId &&
                AuthStore.authUserId == creatorId
            ) {
                setIsLinkOwner(true);
            }
        }, [AuthStore.authUserId, creatorId]);

        const addNewLink = async () => {
            try {
                if (newTitle && newUrl && AuthStore.authUserId) {
                    const { data, error } = await supabase
                        .from('links')
                        .insert({
                            title: newTitle,
                            url: newUrl,
                            user_id: AuthStore.authUserId,
                        })
                        .select();
                    if (error) throw error;
                    console.log('New link successfully created: ', data);
                    if (creatorLinks) {
                        setCreatorLinks([...data, ...creatorLinks]);
                    }
                    setNewTitle('');
                    setNewUrl('');
                }
            } catch (error) {
                console.log('Error in creating new link: ', error);
            }
        };

        // Upload Profile Picture
        const router = useRouter();
        const uploadProfilePicture = async (file: File) => {
            try {
                const { data, error } = await supabase.storage
                    .from('profile_picture')
                    .update(creatorId + '/' + 'avatar', file, {
                        cacheControl: '3600',
                    });
                if (error) {
                    console.error('cant update');
                    const { data, error } = await supabase.storage
                        .from('profile_picture')
                        .upload(creatorId + '/' + 'avatar', file);
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('File uploaded successfully:', data);
                        router.refresh();
                    }
                } else {
                    console.log('File uploaded successfully:', data);
                    router.refresh();
                }
            } catch (error) {
                console.error('uuuuu', error);
            }
        };

        // Read
        const { creatorSlug } = params;
        const [profilePicture, setProfilePicture] = useState<boolean>(false);
        const [creatorLinks, setCreatorLinks] = useState<Link[]>();
        const [isLinkLoading, setIsLinkLoading] = useState<boolean>(true);

        const fetchCreatorId = async () => {
            try {
                // Fetch profile picture and creator ID
                const { data: profileData, error: profileError } =
                    await supabase
                        .from('users')
                        .select('id')
                        .eq('username', creatorSlug);
                if (profileError) throw profileError;

                const fetchedCreatorId = profileData[0]?.id;
                setCreatorId(fetchedCreatorId);
            } catch (error) {
                console.log('Error fetching profile data: ', error);
            }
        };

        useEffect(() => {
            if (creatorSlug) {
                fetchCreatorId();
            }
        }, [creatorSlug]);

        const fetchProfilePicture = async () => {
            try {
                const { data: profilePictureData, error: profileError } =
                    await supabase.storage
                        .from('profile_picture')
                        .list(creatorId + '/', {
                            limit: 100,
                            offset: 0,
                            sortBy: { column: 'name', order: 'asc' },
                        });

                if (profilePictureData) {
                    console.log(profilePictureData[0].name);
                    setProfilePicture(true);
                }
            } catch (error) {
                // Handle errors here
            }
        };

        useEffect(() => {
            if (creatorSlug) {
                fetchProfilePicture();
            }
        }, [creatorSlug]);

        const fetchLinks = async () => {
            try {
                // Fetch creator links using creatorId
                const { data: linksData, error: linksError } = await supabase
                    .from('links')
                    .select('id, title, url')
                    .eq('user_id', creatorId);
                if (linksError) throw linksError;

                setCreatorLinks(linksData);
                setIsLinkLoading(false);
            } catch (error) {
                console.log('Error fetching links data: ', error);
                setIsLinkLoading(false);
            }
        };

        useEffect(() => {
            if (creatorId) {
                fetchLinks();
                fetchProfilePicture();
            }
        }, [creatorId]);

        // Update

        // Delete
        const deleteLink = async (linkId: number) => {
            try {
                const { error } = await supabase
                    .from('links')
                    .delete()
                    .eq('id', linkId)
                    .select();
                if (error) throw error;

                if (creatorLinks) {
                    const updatedLinks = creatorLinks.filter(
                        (link) => link.id !== linkId,
                    );
                    setCreatorLinks(updatedLinks);
                }
            } catch (error) {
                console.log('error: ', error);
            }
        };

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
                            className="w-48 rounded-full"
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
                            className="w-48 rounded-full border border-black"
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
                                onClick={addNewLink}
                            >
                                Add new link
                            </button>
                        </div>

                        <div>
                            <h2 className="pb-3 text-lg font-bold">
                                Upload Profile Picture
                            </h2>
                            <input
                                type="file"
                                onChange={(e) => {
                                    const selectedFile =
                                        e.target.files && e.target.files[0];
                                    if (selectedFile) {
                                        uploadProfilePicture(selectedFile);
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
