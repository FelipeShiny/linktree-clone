import Image from 'next/image';
import React from 'react';
import { ChangeProfilePictureDialog } from './ChangeProfilePictureDialog';

const ProfilePicture = ({
    creatorId,
    profilePicture,
    setProfilePicture,
    router,
}: {
    creatorId: string;
    profilePicture: string;
    setProfilePicture: React.Dispatch<React.SetStateAction<string>>;
    router?: any;
}) => {
    return (
        <div className="relative inline-block">
            <div className="relative">
                {creatorId && profilePicture ? (
                    <Image
                        src={profilePicture}
                        alt="profile_picture"
                        width={0}
                        height={0}
                        sizes={'1'}
                        className="h-48 w-48 rounded-full object-cover shadow-lg"
                        priority
                    />
                ) : (
                    <Image
                        src={'/assets/default-profile-picture.jpg'}
                        alt="profile_picture"
                        width={0}
                        height={0}
                        sizes={'1'}
                        className="h-48 w-48 rounded-full object-cover shadow-lg"
                        priority
                    />
                )}
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
