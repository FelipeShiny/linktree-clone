'use client';

import React from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
    profilePicture?: string;
    username?: string;
    size?: number;
    className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
    profilePicture,
    username = 'User',
    size = 100,
    className = ''
}) => {
    const defaultProfilePicture = '/assets/default-profile-picture.jpg';

    // Use the profile picture URL directly if it exists, otherwise use default
    const imageSource = profilePicture || defaultProfilePicture;

    return (
        <div className={`relative ${className}`}>
            {profilePicture ? (
                <img
                    src={imageSource}
                    alt={`${username}'s profile picture`}
                    width={size}
                    height={size}
                    className="rounded-full object-cover"
                    onError={(e) => {
                        console.error('Error loading profile picture:', e);
                        (e.target as HTMLImageElement).src = defaultProfilePicture;
                    }}
                />
            ) : (
                <Image
                    src={defaultProfilePicture}
                    alt={`${username}'s profile picture`}
                    width={size}
                    height={size}
                    className="rounded-full object-cover"
                />
            )}
        </div>
    );
};

export default ProfilePicture;