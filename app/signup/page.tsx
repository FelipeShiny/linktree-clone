"use client";

import React, { useState } from "react";

const Signup = () => {
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

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
                />
            </div>
            <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
            >
                Email
            </label>
            <div className="mt-1">
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                    placeholder="password"
                />
            </div>
            <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent"
            >
                Sign Up
            </button>
        </div>
    );
};

export default Signup;
