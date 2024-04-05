'use client';

import React, { lazy, Suspense } from 'react';
import CreatorUsernamesList from './components/CreatorUsernamesList';

const Homepage = () => {
    return (
        <div className="m-5 flex flex-col items-center gap-5">
            <h1 className="py-3 font-bold">Creators</h1>
            <CreatorUsernamesList />
        </div>
    );
};

export default Homepage;
