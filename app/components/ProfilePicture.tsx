
import React, { useState } from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
    profilePicture: string;
    username: string;
    size?: number;
    className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
    profilePicture,
    username,
    size = 120,
    className = ''
}) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    // Usar imagem padrão se não houver profilePicture ou se houver erro
    const imageSrc = imageError || !profilePicture || profilePicture === '' 
        ? '/assets/default-profile-picture.jpg' 
        : profilePicture;

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            {imageLoading && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full"
                    style={{ width: size, height: size }}
                >
                    <div className="text-gray-500 text-sm">Carregando...</div>
                </div>
            )}
            <Image
                src={imageSrc}
                alt={`Foto de perfil de ${username}`}
                width={size}
                height={size}
                className="rounded-full object-cover shadow-lg"
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{ 
                    display: imageLoading ? 'none' : 'block',
                    width: size,
                    height: size
                }}
                priority
            />
        </div>
    );
};

export default ProfilePicture;
