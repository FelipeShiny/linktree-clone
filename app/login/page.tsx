"use client";

import React, { useState } from "react";
import supabase from "../utils/supabaseClient";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    async function signInWithEmail() {
        try {
            if (email && password) {
                const resp = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                if (resp.error) throw resp.error;
                const userId = resp.data.user?.id;
                console.log("userId: ", userId);
                router.push("/");
            }
        } catch {}
    }

    return (
        <div>
            <h1>Login</h1>
            <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
            >
                Email
            </label>
            <div className="mt-1">
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
            >
                Password
            </label>
            <div className="mt-1">
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent"
                onClick={signInWithEmail}
            >
                Login
            </button>
        </div>
    );
};

export default Login;
