"use client";

import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import Image from "next/image";
import LinkDropDown from "../components/LinkDropDown";
import { observer } from "mobx-react";
import AuthStore from "../interfaces/AuthStore";
import { v4 as uuidv4 } from "uuid";

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
                        .from("links")
                        .insert({
                            title: newTitle,
                            url: newUrl,
                            user_id: AuthStore.authUserId,
                        })
                        .select();
                    if (error) throw error;
                    console.log("New link successfully created: ", data);
                    if (creatorLinks) {
                        setCreatorLinks([...data, ...creatorLinks]);
                    }
                    setNewTitle("");
                    setNewUrl("");
                }
            } catch (error) {
                console.log("Error in creating new link: ", error);
            }
        };

        // Upload file using standard upload
        const uploadFile = async (file: File) => {
            const { data, error } = await supabase.storage
                .from("profile_picture")
                .upload(creatorId + "/" + uuidv4(), file);
            if (error) {
                // Handle error
                console.error(error);
            } else {
                // Handle success
                console.log("File uploaded successfully:", data);
            }
        };

        // Read
        const { creatorSlug } = params;
        const [profilePicture, setProfilePicture] = useState<
            string | undefined
        >();
        const [creatorLinks, setCreatorLinks] = useState<Link[]>();
        const [isLinkLoading, setIsLinkLoading] = useState<boolean>(true);

        const fetchCreatorId = async () => {
            try {
                // Fetch profile picture and creator ID
                const { data: profileData, error: profileError } =
                    await supabase
                        .from("users")
                        .select("id")
                        .eq("username", creatorSlug);
                if (profileError) throw profileError;

                const fetchedCreatorId = profileData[0]?.id;
                setCreatorId(fetchedCreatorId);
            } catch (error) {
                console.log("Error fetching profile data: ", error);
            }
        };

        useEffect(() => {
            if (creatorSlug) {
                fetchCreatorId();
            }
        }, [creatorSlug]);

        const fetchProfilePicture = async () => {
            try {
                const { data: profilePicture, error: profileError } =
                    await supabase.storage
                        .from("profile_picture")
                        .list(creatorId + "/", {
                            limit: 100,
                            offset: 0,
                            sortBy: { column: "name", order: "asc" },
                        });

                if (profilePicture) {
                    console.log(profilePicture[0].name);
                    setProfilePicture(profilePicture[0].name);
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
                    .from("links")
                    .select("id, title, url")
                    .eq("user_id", creatorId);
                if (linksError) throw linksError;

                setCreatorLinks(linksData);
                setIsLinkLoading(false);
            } catch (error) {
                console.log("Error fetching links data: ", error);
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
                    .from("links")
                    .delete()
                    .eq("id", linkId)
                    .select();
                if (error) throw error;

                if (creatorLinks) {
                    const updatedLinks = creatorLinks.filter(
                        (link) => link.id !== linkId
                    );
                    setCreatorLinks(updatedLinks);
                }
            } catch (error) {
                console.log("error: ", error);
            }
        };

        return (
            <div className="px-5 py-10 flex flex-col h-min-screen gap-5 justify-center items-center">
                {creatorId && profilePicture ? (
                    <div>
                        <Image
                            src={`https://dpehbxmmipfxwdjjmuog.supabase.co/storage/v1/object/public/profile_picture/${creatorId}/${profilePicture}`}
                            alt="profile_picture"
                            width={0}
                            height={0}
                            sizes={"1"}
                            className="w-48 rounded-full"
                            priority
                        />
                    </div>
                ) : (
                    <div>
                        <Image
                            src={"/assets/default-profile-picture.jpg"}
                            alt="profile_picture"
                            width={0}
                            height={0}
                            sizes={"1"}
                            className="w-48 rounded-full border border-black"
                            priority
                        />
                    </div>
                )}
                <h1>@{creatorSlug}</h1>
                <div className="flex flex-col gap-2">
                    {isLinkLoading ? (
                        <h1>Loading...</h1>
                    ) : creatorLinks && creatorLinks.length > 0 ? (
                        creatorLinks.map((link: Link, index: number) => (
                            <div key={index} className="">
                                <div className="p-2 bg-black text-white w-96 grid grid-cols-6 rounded-full">
                                    <div className="col-span-1"></div>
                                    <a
                                        href={
                                            link.url.startsWith("http")
                                                ? link.url
                                                : `https://${link.url}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="col-span-4 my-auto text-center"
                                    >
                                        <h2>{link.title}</h2>
                                    </a>

                                    {isLinkOwner && (
                                        <div className="col-span-1">
                                            <LinkDropDown
                                                deleteLink={deleteLink}
                                                link={link}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <h2>This creator doesn't have any links.</h2>
                    )}
                </div>
                {isLinkOwner && (
                    <>
                        <div className="border flex flex-col items-center gap-2 p-2 bg-grey-100 rounded-lg">
                            <div className="mt-1 flex gap-2">
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={newTitle || ""}
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
                                    value={newUrl || ""}
                                    className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                                    placeholder="URL"
                                    onChange={(e) => setNewUrl(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                className="rounded-md border border-transparent bg-indigo-600 text-white cursor px-2 py-1"
                                onClick={addNewLink}
                            >
                                Add new link
                            </button>
                        </div>

                        <div>
                            <input
                                type="file"
                                onChange={(e) => {
                                    const selectedFile =
                                        e.target.files && e.target.files[0];
                                    if (selectedFile) {
                                        uploadFile(selectedFile);
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }
);

export default CreatorLinksPage;
