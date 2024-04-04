'use client';

import React, { useState, useEffect } from 'react';
import supabase from './utils/supabaseClient';
import Link from 'next/link';

const Homepage = () => {
    const [creatorUsernames, setCreatorUsernames] = useState<string[]>([]);

    useEffect(() => {
        const getCreators = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('username');
            if (error) throw error;

            const usernames = data.map((item) => item.username);
            setCreatorUsernames(usernames);
        };

        getCreators();
    }, []);

    return (
        <div className="m-5 flex flex-col items-center gap-5">
            {/* <Link href={"/tutorial"}>
                <h2 className="bg-blue-300 py-2 px-4 rounded-xl hover:opacity-80">
                    Click me for tutorial
                </h2>
            </Link> */}
            <h1 className="py-3 font-bold">Creators</h1>
            <div className="flex w-full flex-col gap-3">
                {creatorUsernames.map((username, index) => (
                    <Link key={index} href={`/${username}`}>
                        <div className="flex h-16 items-center justify-center rounded-full bg-[#222222] p-2 text-white hover:opacity-80">
                            <h5 className="text-center text-white">
                                {username}
                            </h5>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Homepage;
