"use client";

import React, { Fragment, useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import supabase from "../utils/supabaseClient";
import Image from "next/image";

import { Dialog, Transition } from "@headlessui/react";

type Link = {
    id: string;
    title: string;
    url: string;
};

const Home = ({ params }: { params: { creatorSlug: string } }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | undefined>();
    const [authEmail, setAuthEmail] = useState<string | undefined>();
    let [isOpen, setIsOpen] = useState(false);
    const [editLink, setEditLink] = useState<Link>();

    const [title, setTitle] = useState<string | undefined>();
    const [url, setUrl] = useState<string | undefined>();
    const [links, setLinks] = useState<Link[]>();

    const [images, setImages] = useState<ImageListType>([]);
    const [profilePicture, setProfilePicture] = useState<string | undefined>();

    const { creatorSlug } = params;

    function displayLink(link: Link) {
        setIsOpen(true);
        setEditLink({ id: link.id, title: link.title, url: link.url });
    }

    async function updateLink() {
        console.log(editLink);
        const { data, error } = await supabase
            .from("links")
            .update({
                id: editLink?.id,
                title: editLink?.title,
                url: editLink?.url,
            })
            .eq("user_id", userId);

        if (error) {
            console.log("what the flip", error);
        }

        if (data) {
            console.log("XD", data);
        }

        getLinks();
    }

    function MyDialog() {
        function closeModal() {
            setIsOpen(false);
        }

        return (
            <>
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-10"
                        onClose={closeModal}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Edit Link
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="title"
                                                onChange={(e) => {
                                                    const updatedLink = {
                                                        ...editLink,
                                                        title: e.target.value,
                                                    };
                                                    setEditLink(updatedLink);
                                                }}
                                                value={editLink?.title}
                                            />
                                            <input
                                                type="text"
                                                name="url"
                                                onChange={(e) => {
                                                    const updatedLink = {
                                                        ...editLink,
                                                        url: e.target.value,
                                                    };
                                                    setEditLink(updatedLink);
                                                }}
                                                value={editLink?.url}
                                            />
                                        </div>

                                        <div className="flex flex-row gap-4 mt-4">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={() => {
                                                    updateLink();
                                                    setIsOpen(false);
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </>
        );
    }

    const onChange = (imageList: ImageListType) => {
        setImages(imageList as never[]);
    };

    useEffect(() => {
        const getUser = async () => {
            const user = await supabase.auth.getUser();
            console.log(user.data.user?.email);

            if (user) {
                const userId = user.data.user?.id;
                setIsAuthenticated(true);
                setUserId(userId);
                setAuthEmail(user.data.user?.email);
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
            <MyDialog />
            {userId ? (
                <>
                    <h1>Logged in as {authEmail}</h1>
                    {profilePicture && (
                        <Image
                            src={profilePicture}
                            alt="profile_picture"
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                    )}
                    {links?.map((link: Link, index: number) => (
                        <div key={index}>
                            <h1>{link.title}</h1>
                            <h1>{link.url}</h1>
                            <div className="flex flex-row gap-1">
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
                                <button
                                    className="py-1 px-2 bg-black text-white rounded-lg"
                                    onClick={() => displayLink(link)}
                                >
                                    Edit
                                </button>
                            </div>
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
