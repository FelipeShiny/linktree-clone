
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
    src?: string | null;
    alt: string;
    size?: number | string;
    className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ 
    src, 
    alt, 
    size = 80, 
    className = "" 
}) => {
    const [imageError, setImageError] = useState(false);
    const defaultImage = "/assets/default-profile-picture.jpg";
    
    // Garantir que size seja sempre um número
    const numericSize = typeof size === 'string' ? parseInt(size) || 80 : size;
    
    // Usar imagem padrão se não há src ou houve erro
    const imageSrc = (imageError || !src) ? defaultImage : src;

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div 
            className={`relative overflow-hidden rounded-full ${className}`} 
            style={{ width: numericSize, height: numericSize }}
        >
            <Image
                src={imageSrc}
                alt={alt}
                width={numericSize}
                height={numericSize}
                className="object-cover"
                onError={handleImageError}
                priority={numericSize > 100}
                unoptimized={true}
            />
        </div>
    );
};

export default ProfilePicture;
