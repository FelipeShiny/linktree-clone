
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
                // Get the profile picture filename from the users table
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('profile_picture')
                    .eq('id', userId)
                    .single();

                if (userError || !userData?.profile_picture) {
                    setImageUrl('/assets/default-profile-picture.jpg');
                    setLoading(false);
                    return;
                }

                // Get the public URL for the image
                const { data } = supabase.storage
                    .from('profile-pictures')
                    .getPublicUrl(userData.profile_picture);

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
