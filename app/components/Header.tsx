"use client";

import React, { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import Link from "next/link";

const Header = () => {
    // Authentication
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authUserId, setAuthUserId] = useState<string | undefined>();
    const [authEmail, setAuthEmail] = useState<string | undefined>();
    const [authUsername, setAuthUsername] = useState<string | undefined>();

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

    useEffect(() => {
        getAuthUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
    };

    return (
        <div className="px-10 flex justify-between items-center h-14 bg-black text-white">
            <Link href={"/"}>
                <h2>Linktree Clone</h2>
            </Link>

            {isAuthenticated ? (
                <>
                    <Link href={`/${authUsername}`}>
                        <h2>
                            {authEmail} / {authUsername}
                        </h2>
                    </Link>
                    <button
                        className="bg-red-600 text-white px-2 py-1 rounded-lg"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <Link href={`/login`}>
                    <button>Log in</button>
                </Link>
            )}
        </div>
    );
};

export default Header;
