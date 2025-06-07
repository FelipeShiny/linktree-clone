import React, { useState, useEffect } from 'react';
import { ChangeProfilePictureDialog } from './ChangeProfilePictureDialog';

interface ProfilePictureProps {
    creatorId: string;
    isEditable?: boolean;
    profilePicture: string;
    setProfilePicture: (url: string) => void;
}

export const ProfilePicture = ({ creatorId, isEditable = false, profilePicture, setProfilePicture }: ProfilePictureProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState('/assets/default-profile-picture.jpg');

    useEffect(() => {
        if (profilePicture) {
            // Verificar se a URL é válida do Supabase
            if (profilePicture.includes('supabase.co')) {
                console.log('URL da imagem do Supabase:', profilePicture);
                setImageSrc(profilePicture);
            } else {
                console.log('URL inválida, usando padrão');
                setImageSrc('/assets/default-profile-picture.jpg');
            }
        }
    }, [profilePicture]);

    const handleImageLoad = () => {
        console.log('Imagem carregada com sucesso:', imageSrc);
        setImageLoaded(true);
    };

    const handleImageError = () => {
        console.log('Erro ao carregar imagem, usando padrão');
        setImageSrc('/assets/default-profile-picture.jpg');
        setImageLoaded(true);
    };

    return (
        <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                    src={imageSrc}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                        display: imageLoaded ? 'block' : 'none'
                    }}
                />
                {!imageLoaded && (
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="text-gray-400 text-xs">Loading...</div>
                    </div>
                )}
            </div>
            {isEditable && (
                <ChangeProfilePictureDialog 
                    creatorId={creatorId}
                    profilePicture={profilePicture}
                    setProfilePicture={setProfilePicture}
                />
            )}
        </div>
    );
};