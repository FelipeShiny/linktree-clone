"use client";

import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import Image from "next/image";
import LinkDropDown from "../components/LinkDropDown";

type Link = {
    id: number;
    title: string;
    url: string;
};

const CreatorLinksPage = ({ params }: { params: { creatorSlug: string } }) => {
    // Authentication
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authUserId, setAuthUserId] = useState<string | undefined>();
    const [authEmail, setAuthEmail] = useState<string | undefined>();
    const [authUsername, setAuthUsername] = useState<string | undefined>();
    const [isLinkOwner, setIsLinkOwner] = useState(false);

    useEffect(() => {
        const getAuthUser = async () => {
            const user = await supabase.auth.getUser();
            const userData = user.data.user;

            if (userData) {
                const loggedInUserId = userData?.id;

                setIsAuthenticated(true);
                setAuthUserId(loggedInUserId);
                setAuthEmail(userData?.email);

                try {
                    const { data, error } = await supabase
                        .from("users")
                        .select("username")
                        .eq("id", loggedInUserId);

                    if (error) throw error;
                    setAuthUsername(data[0]?.username);
                } catch (error) {
                    console.log(
                        "Error fetching username of logged in user: ",
                        error
                    );
                }
            }
        };

        getAuthUser();
    }, []);

    // CRUD

    // Create
    const [newTitle, setNewTitle] = useState<string | undefined>();
    const [newUrl, setNewUrl] = useState<string | undefined>();
    const [creatorId, setCreatorId] = useState<string | undefined>();

    useEffect(() => {
        if (authUserId && creatorId && authUserId == creatorId) {
            setIsLinkOwner(true);
        }
    }, [authUserId, creatorId]);

    const addNewLink = async () => {
        try {
            if (newTitle && newUrl && authUserId) {
                const { data, error } = await supabase
                    .from("links")
                    .insert({
                        title: newTitle,
                        url: newUrl,
                        user_id: authUserId,
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

    // Read
    const { creatorSlug } = params;
    const [profilePicture, setProfilePicture] = useState<string | undefined>();
    const [creatorLinks, setCreatorLinks] = useState<Link[]>();
    const [isLinkLoading, setIsLinkLoading] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            // Fetch profile picture and creator ID
            const { data: profileData, error: profileError } = await supabase
                .from("users")
                .select("id, profile_picture_url")
                .eq("username", creatorSlug);
            if (profileError) throw profileError;

            const fetchedCreatorId = profileData[0]?.id;
            setProfilePicture(profileData[0]?.profile_picture_url);
            setCreatorId(fetchedCreatorId);
        } catch (error) {
            console.log("Error fetching profile data: ", error);
        }
    };

    useEffect(() => {
        if (creatorSlug) {
            fetchData();
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
            {isAuthenticated && (
                <button
                    className="bg-black text-white p-1 rounded-lg"
                    onClick={async () => await supabase.auth.signOut()}
                >
                    Sign Out
                </button>
            )}
            <h1>Logged in as: {authUsername}</h1>
            <h1>Logged in email: {authEmail}</h1>
            {profilePicture && (
                <div>
                    <Image
                        src={profilePicture}
                        alt="profile_picture"
                        width={0}
                        height={0}
                        sizes={"1"}
                        className="w-48 rounded-full"
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
                <div className="border flex flex-col items-center gap-2 p-2">
                    <div className="mt-1 flex gap-2">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={newTitle || ""}
                            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                            placeholder="Title"
                            onChange={(e) => setNewTitle(e.target.value)}
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
            )}
        </div>
    );
};

export default CreatorLinksPage;
