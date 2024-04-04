'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react';
import AuthStore from '../interfaces/AuthStore';
import { useRouter } from 'next/navigation';

const Header = observer(() => {
    const router = useRouter();
    async function signOut() {
        try {
            await AuthStore.handleSignOut();

            if (!!!AuthStore.isAuthenticated) {
                console.log('Logged out');
                router.push('/login');
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        setIsUserLoggedIn(AuthStore.isAuthenticated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AuthStore.isAuthenticated]);

    return (
        <div className="flex h-20 items-center justify-between bg-white px-7">
            <Link href={'/'}>
                <h5>Linktree Clone</h5>
            </Link>

            {isUserLoggedIn ? (
                <>
                    <div>
                        <button onClick={signOut}>Sign Out</button>
                    </div>
                </>
            ) : (
                <>
                    <Link href={`/login`}>
                        <button className="text-white">Log in</button>
                    </Link>
                </>
            )}
        </div>
    );
});

export default Header;
