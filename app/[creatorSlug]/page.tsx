import React from 'react';
import { fetchCreatorData } from '../utils/profile';
import CreatorLinks from '../components/CreatorLinks';
import ProfilePicture from '../components/ProfilePicture';

interface PageProps {
    params: Promise<{
        creatorSlug: string;
    }>;
}

export default async function CreatorPage({ params }: PageProps) {
    const { creatorSlug } = await params;

    const creatorData = await fetchCreatorData(creatorSlug);

    if (!creatorData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Criador não encontrado</h1>
                <p className="text-gray-600">O perfil @{creatorSlug} não existe.</p>
            </div>
        );
    }

    const { profile, links } = creatorData;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md mx-auto text-center">
                <div className="mb-6">
                    <ProfilePicture
                        src={profile.avatar_url}
                        alt={`Foto de perfil de ${profile.full_name || profile.username}`}
                        size={120}
                        className="mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold mb-2">
                        {profile.full_name || profile.username}
                    </h1>
                    <p className="text-gray-600 mb-1">@{profile.username}</p>
                    {profile.bio && (
                        <p className="text-gray-800 mb-4">{profile.bio}</p>
                    )}
                </div>

                <CreatorLinks links={links} />
            </div>
        </div>
    );
}