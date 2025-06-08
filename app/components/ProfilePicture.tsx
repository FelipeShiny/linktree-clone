'use client';

import React from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
  userId?: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
  src?: string;
  alt?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  userId,
  avatarUrl,
  size = 80,
  className = '',
  src,
  alt = 'Profile Picture'
}) => {
  // Use src prop first, then avatarUrl, then default
  let imageUrl = src || avatarUrl || '/assets/default-profile-picture.jpg';

  // If we have a Supabase URL, ensure it's properly formatted
  if (imageUrl && imageUrl.includes('supabase.co')) {
    // Ensure the URL is complete and properly formatted
    if (!imageUrl.startsWith('http')) {
      imageUrl = `https://vxquljeazujpsufkckhp.supabase.co/storage/v1/object/public/profile-pictures/${imageUrl}`;
    }
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={imageUrl}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
        priority
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/assets/default-profile-picture.jpg';
        }}
      />
    </div>
  );
};

export default ProfilePicture;