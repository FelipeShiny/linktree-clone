
'use client';

import React from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
    src?: string;
    alt: string;
    size?: number;
    className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ 
    src, 
    alt, 
    size = 80, 
    className = '' 
}) => {
    const defaultImage = '/assets/default-profile-picture.jpg';
    const imageUrl = src || defaultImage;

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <Image
                src={imageUrl}
                alt={alt}
                width={size}
                height={size}
                className="rounded-full object-cover"
                unoptimized
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultImage;
                }}
            />
        </div>
    );
};

export default ProfilePicture;
