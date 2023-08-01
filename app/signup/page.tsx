"use client";

import React, { useState } from "react";
import supabase from "../utils/supabaseClient";

const SignUp = () => {
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    async function signUpWithEmail() {
        try {
            if (email && password) {
                const resp = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });
                if (resp.error) throw resp.error;
                const userId = resp.data.user?.id;
                if (userId) {
                    await createUser(userId);
                }
                console.log("userId: ", userId);
            }
        } catch {}
    }

    async function createUser(userId: string) {
        try {
            const { error } = await supabase
                .from("users")
                .insert({ id: userId });
            if (error) throw error;
        } catch (error) {
            console.log("error: ", error);
        }
    }

    return (
        <div>
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
                onClick={signUpWithEmail}
            >
                Sign Up
            </button>
        </div>
    );
};

export default SignUp;
