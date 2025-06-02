import Image from 'next/image';
import { getProfilePictureUrl } from '../utils/profile';

interface ProfilePictureProps {
    creatorId: string;
    username?: string;
    size?: number;
}

export default function ProfilePicture({ 
    creatorId, 
    username, 
    size = 96 
}: ProfilePictureProps) {
    const profilePictureUrl = getProfilePictureUrl(creatorId);

    return (
        <div className="relative">
            <Image
                src={profilePictureUrl}
                alt={`${username || 'User'}'s profile picture`}
                width={size}
                height={size}
                className="rounded-full object-cover"
                onError={(e) => {
                    // Fallback para imagem padrão em caso de erro
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/default-profile-picture.jpg';
                }}
            />
        </div>
    );
}