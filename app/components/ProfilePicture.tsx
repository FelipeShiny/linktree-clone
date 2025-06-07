import Image from 'next/image';
import React from 'react';
import { ChangeProfilePictureDialog } from './ChangeProfilePictureDialog';

const ProfilePicture = ({
    creatorId,
    profilePicture,
    setProfilePicture,
    router,
    size = 192,
}: {
    creatorId: string;
    profilePicture?: string;
    setProfilePicture?: React.Dispatch<React.SetStateAction<string>>;
    router?: any;
    size?: number;
}) => {
    return (
        <div className="relative inline-block">
            <div className="relative">
                <Image
                    src={profilePicture || '/assets/default-profile-picture.jpg'}
                    alt="profile_picture"
                    width={size}
                    height={size}
                    className={`rounded-full object-cover shadow-lg`}
                    style={{ width: size, height: size }}
                    priority
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

export default ProfilePicture;
