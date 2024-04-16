'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react';
import AuthStore from '../interfaces/AuthStore';
import Link from 'next/link';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = observer(() => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    useEffect(() => {
        if (AuthStore.isAuthenticated) {
            router.push('/admin');
        }
    }, [router]);

    async function signInWithEmail(e: any) {
        e.preventDefault();

        try {
            if (email && password) {
                await AuthStore.signInWithEmail(email, password);

                if (AuthStore.isAuthenticated) {
                    console.log('Logged in');
                    setIsLoggedIn(true);
                    const interval = setInterval(() => {
                        if (AuthStore.authUsername !== '') {
                            clearInterval(interval); // Stop the interval once isAuthenticated becomes true
                            router.push('/admin');
                        }
                    }, 200);
                }
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    return (
        <div className="flex items-center justify-center py-10">
            {!isLoggedIn ? (
                <form className="flex flex-col gap-3 rounded-xl border-black bg-white p-10 shadow-2xl">
                    <h2>Login</h2>
                    <div className="items-left flex flex-col">
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
                                className="block w-full rounded-md border-gray-300 bg-[#f3f3f1] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                                placeholder="you@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="items-left flex flex-col">
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
                                className="block w-full rounded-md border-gray-300  bg-[#f3f3f1] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                                placeholder="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="rounded-lg border-2 bg-[#222222] px-4 py-1 text-white hover:opacity-80"
                        onClick={signInWithEmail}
                    >
                        Login
                    </button>
                    <div className="flex items-center gap-3">
                        <h4>Need account?</h4>
                        <Link href={'/signup'}>
                            <button>
                                <p>Sign Up</p>
                            </button>
                        </Link>
                    </div>
                    <div className="flex flex-col rounded-xl bg-[#222222] p-5 md:mx-auto ">
                        <h5 className="font-semibold text-white">
                            Login credentials for test_user
                        </h5>
                        <p className="text-white">
                            Email: anwari.fikri@gmail.com
                        </p>
                        <p className="text-white">Password: test_user123</p>
                    </div>
                </form>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );
});

export default Login;
