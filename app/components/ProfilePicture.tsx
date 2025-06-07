import React from 'react';
import { ChangeProfilePictureDialog } from './ChangeProfilePictureDialog';
// REMOVIDO: import Image from 'next/image'; // Não precisamos mais dele

interface ProfilePictureProps {
    creatorId: string;
    profilePicture?: string;
    setProfilePicture?: React.Dispatch<React.SetStateAction<string>>;
    router?: any;
    size?: number;
}

export default function ProfilePicture({
    creatorId,
    profilePicture,
    setProfilePicture,
    router,
    size = 192,
}: ProfilePictureProps) {
    return (
        <div className="relative inline-block">
            <div className="relative">
                {/* CORRIGIDO: Substituído <Image> do Next.js por <img> HTML padrão */}
                <img
                    src={profilePicture || '/assets/default-profile-picture.jpg'} // A URL vem daqui
                    alt="profile_picture"
                    width={size}
                    height={size}
                    className={`rounded-full object-cover shadow-lg`}
                    style={{ width: size, height: size }}
                    // 'priority' não é uma prop de <img>
                    // 'onError' é uma prop de <img> normal
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/default-profile-picture.jpg';
                    }}
                />
            </div>
            {router && (
                <ChangeProfilePictureDialog
                    router={router}
                    creatorId={creatorId}
                    setProfilePicture={setProfilePicture}
                />
            )}
        </div>
    );
};

// export default ProfilePicture; // Já é exportado por padrão