
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { getProfilePictureUrl } from '../utils/profile';

interface ProfilePictureProps {
    userId?: string;
    src?: string;
    avatarUrl?: string;
    size?: number;
    className?: string;
    alt?: string;
}

export default function ProfilePicture({ 
    userId, 
    src, 
    avatarUrl, 
    size = 48, 
    className = '', 
    alt = 'Profile Picture' 
}: ProfilePictureProps) {
    const [imageUrl, setImageUrl] = useState<string>('/assets/default-profile-picture.jpg');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfilePicture = async () => {
            try {
                // Se já temos src ou avatarUrl diretamente, usar eles
                if (src) {
                    setImageUrl(getProfilePictureUrl(src));
                    setLoading(false);
                    return;
                }

                if (avatarUrl) {
                    setImageUrl(getProfilePictureUrl(avatarUrl));
                    setLoading(false);
                    return;
                }

                // Se temos userId, buscar do banco
                if (userId) {
                    const { data: userData, error: userError } = await supabase
                        .from('profiles')
                        .select('avatar_url')
                        .eq('id', userId)
                        .single();

                    if (userError || !userData?.avatar_url) {
                        console.log('No avatar_url found, using default');
                        setImageUrl('/assets/default-profile-picture.jpg');
                        setLoading(false);
                        return;
                    }

                    setImageUrl(getProfilePictureUrl(userData.avatar_url));
                } else {
                    setImageUrl('/assets/default-profile-picture.jpg');
                }
            } catch (error) {
                console.error('Error loading profile picture:', error);
                setImageUrl('/assets/default-profile-picture.jpg');
            } finally {
                setLoading(false);
            }
        };

        loadProfilePicture();
    }, [userId, src, avatarUrl]);

    const sizeClass = size ? `w-${Math.floor(size/4)} h-${Math.floor(size/4)}` : '';
    const inlineSize = size ? { width: `${size}px`, height: `${size}px` } : {};

    if (loading) {
        return (
            <div 
                className={`animate-pulse bg-gray-300 rounded-full ${sizeClass} ${className}`}
                style={inlineSize}
            >
                <div className="w-full h-full bg-gray-300 rounded-full"></div>
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={`rounded-full object-cover ${sizeClass} ${className}`}
            style={inlineSize}
            onError={() => {
                console.log('Image failed to load, using default');
                setImageUrl('/assets/default-profile-picture.jpg');
            }}
        />
    );
}
