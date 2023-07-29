"use client";

import React, { useEffect, useState } from "react";
import supabase from "./utils/supabaseClient";

type Link = {
    title: string;
    url: string;
};

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | undefined>();

    const [title, setTitle] = useState<string | undefined>();
    const [url, setUrl] = useState<string | undefined>();
    const [links, setLinks] = useState<Link[]>();

    useEffect(() => {
        const getUser = async () => {
            const user = await supabase.auth.getUser();
            console.log("user", user);

            if (user) {
                const userId = user.data.user?.id;
                setIsAuthenticated(true);
                setUserId(userId);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        const getLinks = async () => {
            try {
                const { data, error } = await supabase
                    .from("links")
                    .select("title, url")
                    .eq("user_id", userId);

                if (error) throw error;

                setLinks(data);
            } catch (error) {
                console.log("error: ", error);
            }
        };

        if (userId) {
            getLinks();
        }
    }, [userId]);

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
            }
        } catch (error) {
            console.log("error: ", error);
        }
    };

    return (
        <div>
            {links?.map((link: Link, index: number) => (
                <div key={index}>
                    <h1>{link.title}</h1>
                    <h1>{link.url}</h1>
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
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                            placeholder="my reaction to that url"
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600"
                        onClick={addNewLink}
                    >
                        Add new link
                    </button>
                </>
            )}
        </div>
    );
};

export default Home;
