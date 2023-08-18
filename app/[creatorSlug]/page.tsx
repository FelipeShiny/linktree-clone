"use client";

import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

type Link = {
    id: number;
    title: string;
    url: string;
};

const CreatorLinksPage = () => {
    // Authentication
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authUserId, setAuthUserId] = useState<string | undefined>();
    const [authEmail, setAuthEmail] = useState<string | undefined>();
    const [authUsername, setAuthUsername] = useState<string | undefined>();

    useEffect(() => {
        const getUser = async () => {
            const user = await supabase.auth.getUser();
            const userData = user.data.user;

            if (userData) {
                const userId = userData?.id;

                setIsAuthenticated(true);
                setAuthUserId(userId);
                setAuthEmail(userData?.email);

                try {
                    const { data, error } = await supabase
                        .from("users")
                        .select("username")
                        .eq("id", userId);

                    if (error) throw error;
                    setAuthUsername(data[0]?.username);
                } catch (error) {
                    console.log("Error fetching username: ", error);
                }
            }
        };

        getUser();
    }, []);

    return (
        <div>
            <h1>Hello, {authUsername}!</h1>
            <h1>Your email is {authEmail}!</h1>
            <h1>image</h1>
            <h1>Links:</h1>
            <h1>link 1</h1>
            <h1>link 2</h1>
            <h1>link 3</h1>
        </div>
    );
};

export default CreatorLinksPage;
