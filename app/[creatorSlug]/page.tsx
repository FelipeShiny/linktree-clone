
'use client';

import React, { useState, useEffect } from 'react';
import { fetchCreatorData } from '../utils/profile';
import ProfilePicture from '../components/ProfilePicture';

interface PageProps {
    params: Promise<{
        creatorSlug: string;
    }>;
}

export default function CreatorPage({ params }: PageProps) {
    const [creatorData, setCreatorData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [creatorSlug, setCreatorSlug] = useState<string>('');

    useEffect(() => {
        const loadCreatorData = async () => {
            try {
                const resolvedParams = await params;
                const slug = resolvedParams.creatorSlug;
                setCreatorSlug(slug);

                const data = await fetchCreatorData(slug);
                setCreatorData(data);
            } catch (error) {
                console.error('Error loading creator data:', error);
                setCreatorData(null);
            } finally {
                setLoading(false);
            }
        };

        loadCreatorData();
    }, [params]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-lg">Carregando...</div>
            </div>
        );
    }

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
                        avatarUrl={profile.avatar_url}
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

                <div className="space-y-3">
                    {links && links.length > 0 ? (
                        links.map((link: any) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-center"
                            >
                                <span className="text-gray-800 font-medium">
                                    {link.title}
                                </span>
                            </a>
                        ))
                    ) : (
                        <p className="text-gray-500">Nenhum link encontrado</p>
                    )}
                </div>
            </div>
        </div>
    );
}
