import React, { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';
import Link from 'next/link';

const CreatorUsernamesList = () => {
    const [creatorUsernames, setCreatorUsernames] = useState<string[]>([]);

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username');
                if (error) throw error;
                const usernames = data.map((item: any) => item.username);
                setCreatorUsernames(usernames);
            } catch (error) {
                // Handle error if needed
                console.error('Error fetching creators:', error);
            }
        };

        fetchCreators();
    }, []);

    return (
        <div className="flex w-full flex-col gap-3">
            {creatorUsernames.map((username, index) => (
                <Link key={index} href={`/${username}`}>
                    <div className="flex h-16 items-center justify-center rounded-full bg-[#222222] p-2 text-white hover:opacity-80">
                        <h5 className="text-center text-white">{username}</h5>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default CreatorUsernamesList;
