
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProfilePicture from '../components/ProfilePicture';
import CreatorLinks from '../components/CreatorLinks';
import { fetchCreatorData, fetchLinks, fetchProfilePicture } from '../utils/profile';
import { Link } from '../types/linkTypes';

const CreatorPage = () => {
    const params = useParams();
    const creatorSlug = params?.creatorSlug as string;

    const [creatorData, setCreatorData] = useState<any>(null);
    const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
    const [profilePicture, setProfilePicture] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (creatorSlug) {
            const loadCreatorProfile = async () => {
                try {
                    setIsLoading(true);
                    setError('');

                    // Buscar dados do criador pelo username
                    const userData = await fetchCreatorData(creatorSlug);
                    
                    if (userData) {
                        setCreatorData(userData);
                        
                        // Buscar links e foto de perfil
                        await Promise.all([
                            fetchLinks(userData.id, setCreatorLinks, () => {}),
                            fetchProfilePicture(userData.id, setProfilePicture)
                        ]);
                    } else {
                        setError('Perfil não encontrado');
                    }
                } catch (err) {
                    console.error('Erro ao carregar perfil:', err);
                    setError('Erro ao carregar perfil');
                } finally {
                    setIsLoading(false);
                }
            };

            loadCreatorProfile();
        }
    }, [creatorSlug]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2>Carregando perfil...</h2>
                </div>
            </div>
        );
    }

    if (error || !creatorData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2>Perfil não encontrado</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-5 px-5 py-10">
            <ProfilePicture
                creatorId={creatorData.id}
                profilePicture={profilePicture}
                username={creatorData.username}
                size={96}
            />
            <h2>@{creatorData.username}</h2>
            
            <CreatorLinks creatorLinks={creatorLinks} />
        </div>
    );
};

export default CreatorPage;
