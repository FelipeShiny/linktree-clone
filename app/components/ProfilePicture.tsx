
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

interface ProfilePictureProps {
    userId: string;
    className?: string;
    alt?: string;
}

export default function ProfilePicture({ userId, className = '', alt = 'Profile Picture' }: ProfilePictureProps) {
    const [imageUrl, setImageUrl] = useState<string>('/assets/default-profile-picture.jpg');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfilePicture = async () => {
            try {
                // Get the profile picture filename from the profiles table
                const { data: userData, error: userError } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', userId)
                    .single();

                if (userError || !userData?.avatar_url) {
                    setImageUrl('/assets/default-profile-picture.jpg');
                    setLoading(false);
                    return;
                }

                // If it's already a full URL, use it directly
                if (userData.avatar_url.startsWith('http')) {
                    setImageUrl(userData.avatar_url);
                } else {
                    // Get the public URL for the image from storage
                    const { data } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(userData.avatar_url);

                    if (data?.publicUrl) {
                        setImageUrl(data.publicUrl);
                    }
                }

                if (data?.publicUrl) {
                    setImageUrl(data.publicUrl);
                }
            } catch (error) {
                console.error('Error loading profile picture:', error);
                setImageUrl('/assets/default-profile-picture.jpg');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadProfilePicture();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className={`animate-pulse bg-gray-300 rounded-full ${className}`}>
                <div className="w-full h-full bg-gray-300 rounded-full"></div>
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={`rounded-full object-cover ${className}`}
            onError={() => setImageUrl('/assets/default-profile-picture.jpg')}
        />
    );
}
