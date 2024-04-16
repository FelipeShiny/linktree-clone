'use client';

import React, { useState } from 'react';
import supabase from '../utils/supabaseClient';
import { observer } from 'mobx-react';
import AuthStore from '../interfaces/AuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignUp = observer(() => {
    const router = useRouter();

    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [username, setUsername] = useState<string | undefined>();

    async function checkUsernameTaken() {
        if (username) {
            try {
                console.log('Checking username availability for:', username);
                const { data, error } = await supabase
                    .from('users')
                    .select('username')
                    .eq('username', username)
                    .maybeSingle();

                if (error) {
                    console.error('Error:', error);
                    return false;
                }

                if (data) {
                    console.log('Username already taken:', data);
                    return true;
                }

                return false;
            } catch (error) {
                console.error('Error checking username:', error);
                return false;
            }
        }
    }

    async function signUp(e: any) {
        e.preventDefault();

        const isUsernameTaken = await checkUsernameTaken();

        if (!isUsernameTaken) {
            console.log('You can signup!');
            try {
                if (email && password && username) {
                    await AuthStore.signUpWithEmail(email, password, username);
                    console.log('Sign up successful');
                    router.push(`/${username}`);
                }
            } catch (error) {
                console.log('Signup error:', error);
            }
            // Proceed with signup logic here
        } else {
            console.log('username is taken. choose another one');
        }
    }

    // async function signUp() {
    //     await setUsernameTaken(checkUsernameTaken());

    // }

    return (
        <div className="flex items-center justify-center py-10">
            <form className="flex flex-col gap-3 rounded-xl border-black bg-white p-10 shadow-2xl">
                <h2>Sign Up</h2>
                <div className="items-left flex flex-col">
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
                            required
                        />
                    </div>
                </div>
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
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                            placeholder="you@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button
                    className="mt-4 rounded-lg border-2 bg-black px-4 py-1 text-white hover:border-black hover:bg-white hover:text-black"
                    onClick={signUp}
                >
                    Sign Up
                </button>
                <div className="flex items-center gap-3">
                    <h4>Already have an account?</h4>
                    <Link href={'/login'}>
                        <button>
                            <p>Login</p>
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
});

export default SignUp;
