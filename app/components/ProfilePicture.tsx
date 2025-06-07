import React from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ 
  src, 
  alt = "Profile picture", 
  size = 200,
  className = ""
}) => {
  const defaultAvatar = "/assets/default-profile-picture.jpg";

  return (
    <div className={`relative rounded-full overflow-hidden ${className}`} style={{ width: size, height: size }}>
      <Image
        src={src || defaultAvatar}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        unoptimized
        onError={(e) => {
          console.error('Error loading profile picture:', src);
          const target = e.target as HTMLImageElement;
          target.src = defaultAvatar;
        }}
      />
    </div>
  );
};

export default ProfilePicture;