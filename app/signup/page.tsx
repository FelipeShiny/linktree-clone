"use client";

import React, { useState } from "react";
import supabase from "../utils/supabaseClient";
import { observer } from "mobx-react";
import AuthStore from "../interfaces/AuthStore";
import { useRouter } from "next/navigation";

const SignUp = observer(() => {
    const router = useRouter();

    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [username, setUsername] = useState<string | undefined>();

    async function signUp() {
        try {
            if (email && password && username) {
                await AuthStore.signUpWithEmail(email, password, username);
                console.log("Sign up successful");
                router.push(`/${username}`);
            }
        } catch (error) {
            console.log("Signup error:", error);
        }
    }

    return (
        <div>
            <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
            >
                Username
            </label>
            <div className="mt-1">
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
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
                onClick={signUp}
            >
                Sign Up
            </button>
        </div>
    );
});

export default SignUp;
