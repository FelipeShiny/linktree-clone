"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import AuthStore from "../interfaces/AuthStore";
import Link from "next/link";

const Login = observer(() => {
    const router = useRouter();
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    async function signInWithEmail() {
        try {
            if (email && password) {
                await AuthStore.signInWithEmail(email, password);

                if (AuthStore.isAuthenticated) {
                    console.log("Logged in");
                    router.push("/");
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    return (
        <div className="flex flex-col h-screen items-center justify-center ">
            <div className="flex flex-col gap-3 border-black rounded-xl p-10 shadow-2xl">
                <h1 className="text-2xl">Login</h1>
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
                    className="bg-black text-white px-4 py-1 rounded-lg border-2 hover:bg-white hover:text-black hover:border-black"
                    onClick={signInWithEmail}
                >
                    Login
                </button>
                <div className="flex items-center gap-3">
                    <h2>Need account?</h2>
                    <Link href={"/signup"}>
                        <button className="border-2 border-black bg-white text-black px-4 py-1 rounded-lg hover:bg-black hover:text-white">
                            Sign Up
                        </button>
                    </Link>
                </div>
                <div className="flex flex-col p-5 bg-black text-white rounded-xl md:mx-auto ">
                    <h2 className="text-lg font-bold">
                        Login Credential for test_user
                    </h2>
                    <p>Email: anwari.fikri@gmail.com</p>
                    <p>Password: test_user123</p>
                </div>
            </div>
        </div>
    );
});

export default Login;
