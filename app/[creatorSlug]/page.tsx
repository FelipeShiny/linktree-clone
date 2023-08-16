"use client";

import React, { useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import supabase from "../utils/supabaseClient";
import Image from "next/image";

type Link = {
    id: string;
    title: string;
    url: string;
};

const Home = ({ params }: { params: { creatorSlug: string } }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | undefined>();

    const [title, setTitle] = useState<string | undefined>();
    const [url, setUrl] = useState<string | undefined>();
    const [links, setLinks] = useState<Link[]>();

    const [images, setImages] = useState<ImageListType>([]);
    const [profilePicture, setProfilePicture] = useState<string | undefined>();

    const { creatorSlug } = params;

    const onChange = (imageList: ImageListType) => {
        setImages(imageList as never[]);
    };

    useEffect(() => {
        const getUser = async () => {
            const user = await supabase.auth.getUser();

            if (user) {
                const userId = user.data.user?.id;
                setIsAuthenticated(true);
                setUserId(userId);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        if (userId) {
            getLinks();
        }
    }, [userId]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select("id, profile_picture_url")
                    .eq("username", creatorSlug);
                if (error) throw error;
                const profilePicture = data[0]["profile_picture_url"];
                setProfilePicture(profilePicture);
                const userId = data[0]["id"];
                setUserId(userId);
            } catch (error) {
                console.log("error: ", error);
            }
        };

        if (creatorSlug) {
            getUser();
        }
    }, [creatorSlug]);

    // Create
    const addNewLink = async () => {
        try {
            if (title && url && userId) {
                const { data, error } = await supabase
                    .from("links")
                    .insert({
                        title: title,
                        url: url,
                        user_id: userId,
                    })
                    .select();
                if (error) throw error;
                console.log("data: ", data);
                if (links) {
                    setLinks([...data, ...links]);
                }
                setTitle("");
                setUrl("");
            }
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // Read
    const getLinks = async () => {
        try {
            const { data, error } = await supabase
                .from("links")
                .select("id, title, url")
                .eq("user_id", userId);

            if (error) throw error;

            setLinks(data);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // Update

    // Delete
    const deleteLink = async (linkId: string) => {
        try {
            const { error } = await supabase
                .from("links")
                .delete()
                .eq("id", linkId);

            if (error) throw error;

            // Optionally, you can update the state to reflect the new list of links after deletion.
            // For simplicity, we will re-fetch all links after deletion.
            getLinks();
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const uploadProfilePicture = async () => {
        try {
            if (images.length > 0) {
                const image = images[0];
                if (image.file && userId) {
                    const { data, error } = await supabase.storage
                        .from("public")
                        .upload(`${userId}/${image.file.name}`, image.file, {
                            upsert: true,
                        });
                    if (error) throw error;
                    const resp = supabase.storage
                        .from("public")
                        .getPublicUrl(data.path);
                    const publicUrl = resp.data.publicUrl;
                    const updateUserResponse = await supabase
                        .from("users")
                        .update({ profile_picture_url: publicUrl })
                        .eq("id", userId);
                    if (updateUserResponse.error) throw error;
                }
            }
        } catch (error) {
            console.log("error: ", error);
        }
    };

    return (
        <div>
            {profilePicture && (
                <Image
                    src={profilePicture}
                    alt="profile_picture"
                    width={100}
                    height={100}
                    className="rounded-full"
                />
            )}
            {userId ? (
                <>
                    {links?.map((link: Link, index: number) => (
                        <div key={index}>
                            <h1>{link.title}</h1>
                            <h1>{link.url}</h1>
                            <button
                                className="py-1 px-2 bg-black text-white rounded-lg"
                                onClick={() => {
                                    const confirmDelete = window.confirm(
                                        "Are you sure you want to delete this?"
                                    );
                                    if (confirmDelete) {
                                        deleteLink(link.id);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {isAuthenticated && (
                        <>
                            <div className="mt-1">
                                <p>Title</p>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={title || ""}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                                    placeholder="me when I link"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="mt-1">
                                <p>URL</p>
                                <input
                                    type="text"
                                    name="url"
                                    id="url"
                                    value={url || ""}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                                    placeholder="my reaction to that url"
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 text-white cursor px-2 py-1 m-1"
                                onClick={addNewLink}
                            >
                                Add new link
                            </button>
                            <div className="App">
                                <ImageUploading
                                    multiple
                                    value={images}
                                    onChange={onChange}
                                    maxNumber={1}
                                >
                                    {({
                                        imageList,
                                        onImageUpload,
                                        onImageRemoveAll,
                                        onImageUpdate,
                                        onImageRemove,
                                        isDragging,
                                        dragProps,
                                    }) => (
                                        <div>
                                            <button
                                                className="py-1 px-2 bg-black text-white m-1 rounded-lg"
                                                style={
                                                    isDragging
                                                        ? { color: "red" }
                                                        : undefined
                                                }
                                                onClick={onImageUpload}
                                                {...dragProps}
                                            >
                                                Click or Drop here
                                            </button>
                                            &nbsp;
                                            <button
                                                className="py-1 px-2 bg-black text-white m-1 rounded-lg"
                                                onClick={onImageRemoveAll}
                                            >
                                                Remove all images
                                            </button>
                                            {imageList.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="image-item"
                                                >
                                                    <img
                                                        src={image.dataURL}
                                                        alt=""
                                                        width="100"
                                                    />
                                                    <div className="image-item__btn-wrapper">
                                                        <button
                                                            onClick={() =>
                                                                onImageUpdate(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                onImageRemove(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ImageUploading>

                                <button
                                    className="bg-indigo-600 text-white px-2 py-1 m-1 rounded-lg"
                                    type="button"
                                    onClick={uploadProfilePicture}
                                >
                                    Upload profile picture
                                </button>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <h1>no user</h1>
            )}
        </div>
    );
};

export default Home;
