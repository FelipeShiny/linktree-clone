
import React, { useState, useEffect } from 'react';
import { ChangeProfilePictureDialog } from './ChangeProfilePictureDialog';

interface ProfilePictureProps {
    creatorId: string;
    profilePicture?: string;
    setProfilePicture?: React.Dispatch<React.SetStateAction<string>>;
    router?: any;
    size?: number;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
    creatorId,
    profilePicture,
    setProfilePicture,
    router,
    size = 192,
}) => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        // Construir URL da imagem de forma robusta
        const buildImageUrl = () => {
            if (profilePicture && profilePicture.startsWith('http')) {
                // Se já é uma URL completa, usar diretamente
                return profilePicture;
            }
            
            // Construir URL usando variável de ambiente
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            if (supabaseUrl && creatorId) {
                // Adicionar timestamp para quebrar cache
                const timestamp = Date.now();
                return `${supabaseUrl}/storage/v1/object/public/avatars/${creatorId}/avatar?v=${timestamp}`;
            }
            
            return '/assets/default-profile-picture.jpg';
        };

        const url = buildImageUrl();
        setImageUrl(url);
        setHasError(false);
    }, [profilePicture, creatorId]);

    const handleImageError = () => {
        console.log('Erro ao carregar imagem, usando padrão');
        setHasError(true);
        setImageUrl('/assets/default-profile-picture.jpg');
    };

    const handleImageLoad = () => {
        console.log('Imagem carregada com sucesso:', imageUrl);
        setHasError(false);
    };

    return (
        <div className="relative inline-block">
            <div className="relative">
                <img
                    src={hasError ? '/assets/default-profile-picture.jpg' : imageUrl}
                    alt="Profile picture"
                    width={size}
                    height={size}
                    className="rounded-full object-cover shadow-lg border-4 border-white"
                    style={{ width: size, height: size }}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    crossOrigin="anonymous"
                />
            </div>
            {router && setProfilePicture && (
                <ChangeProfilePictureDialog
                    router={router}
                    creatorId={creatorId}
                    setProfilePicture={setProfilePicture}
                />
            )}
        </div>
    );
};

export default ProfilePicture;
