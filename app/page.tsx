"use client";

import React, { useState, useEffect } from "react";
import supabase from "./utils/supabaseClient";
import Link from "next/link";

const Homepage = () => {
    const [creatorUsernames, setCreatorUsernames] = useState<string[]>([]);

    useEffect(() => {
        const getCreators = async () => {
            const { data, error } = await supabase
                .from("users")
                .select("username");
            if (error) throw error;

            const usernames = data.map((item) => item.username);
            setCreatorUsernames(usernames);
        };

        getCreators();
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h1>Linktree clone</h1>
            <div className="flex flex-col gap-2">
                {creatorUsernames.map((username, index) => (
                    <Link key={index} href={`/${username}`}>
                        <p className="bg-black text-white p-2 rounded-lg">
                            {username}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Homepage;
