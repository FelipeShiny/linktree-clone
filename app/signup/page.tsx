"use client";

import React, { useState } from "react";
import supabase from "../utils/supabaseClient";
import { observer } from "mobx-react";
import AuthStore from "../interfaces/AuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <div className="flex flex-col h-screen items-center justify-center ">
            <div className="flex flex-col gap-3 border-black rounded-xl p-10 shadow-2xl">
                <h1 className="text-2xl">Sign Up</h1>
                <div className="flex flex-col items-left">
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
                </div>
                <div className="flex flex-col items-left">
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
                </div>
                <div className="flex flex-col items-left">
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
                </div>
                <button
                    type="button"
                    className="mt-4 bg-black text-white px-4 py-1 rounded-lg border-2 hover:bg-white hover:text-black hover:border-black"
                    onClick={signUp}
                >
                    Sign Up
                </button>
                <div className="flex items-center gap-3">
                    <h2>Already have account kah?</h2>
                    <Link href={"/login"}>
                        <button className="border-2 border-black bg-white text-black px-4 py-1 rounded-lg hover:bg-black hover:text-white">
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
});

export default SignUp;
