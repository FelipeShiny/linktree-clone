"use client";

import React, { useEffect, useState } from "react";
import supabase from "./utils/supabaseClient";

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | undefined>();

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

    return <div>Home</div>;
};

export default Home;
