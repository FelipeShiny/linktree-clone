import React, { useState } from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
    src?: string | null;
    alt: string;
    size?: number;
    className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ 
    src, 
    alt, 
    size = 80, 
    className = "" 
}) => {
    const defaultImage = "/assets/default-profile-picture.jpg";

    return (
        <div className={`relative overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }}>
            <Image
                src={src || defaultImage}
                alt={alt}
                width={size}
                height={size}
                className="object-cover"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultImage;
                }}
            />
        </div>
    );
};

export default ProfilePicture;