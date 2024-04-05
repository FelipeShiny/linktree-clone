import React from 'react';
import LoadingSpinner from './components/LoadingSpinner';

const Loading = () => {
    return (
        <div className="-my-20 mx-auto flex min-h-screen flex-col items-center justify-center">
            <LoadingSpinner />
        </div>
    );
};

export default Loading;
