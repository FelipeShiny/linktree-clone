
import React from 'react';
import { ChangeProfilePictureDialog } from './ChangeProfilePictureDialog';

interface ProfilePictureProps {
    creatorId: string;
    profilePicture?: string;
    setProfilePicture?: React.Dispatch<React.SetStateAction<string>>;
    router?: any;
    size?: number;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
    creatorId,
    profilePicture,
    setProfilePicture,
    router,
    size = 192,
}) => {
    return (
        <div className="relative inline-block">
            <div className="relative">
                <img
                    src={profilePicture || '/assets/default-profile-picture.jpg'}
                    alt="profile_picture"
                    width={size}
                    height={size}
                    className="rounded-full object-cover shadow-lg"
                    style={{ width: size, height: size }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/default-profile-picture.jpg';
                    }}
                />
            </div>
            {router && setProfilePicture && (
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
