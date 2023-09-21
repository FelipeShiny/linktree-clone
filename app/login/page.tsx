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
        } catch (error) {
            console.log("error", error);
        }
    }

    return (
        <div className="flex flex-col justify-center h-[calc(100vh-74px)] m-2 gap-5">
            <div className="bg-gray-200 p-5 pb-10 rounded-xl flex flex-col gap-3 md:w-1/2 md:mx-auto ">
                <h1 className="text-xl font-bold">Login</h1>
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
                </div>
                <div>
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
                    className="py-1 items-center rounded-md border border-transparent bg-black text-white"
                    onClick={signInWithEmail}
                >
                    Login
                </button>
            </div>
            <div className="flex flex-col p-5 bg-black text-white rounded-xl md:w-1/2 md:mx-auto ">
                <h2 className="text-lg font-bold">
                    Login Credential for test_user
                </h2>
                <p>Email: anwari.fikri@gmail.com</p>
                <p>Password: test_user123</p>
            </div>
        </div>
    );
};

export default Login;
