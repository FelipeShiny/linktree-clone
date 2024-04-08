import { Pencil } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { ChangeProfilePictureDialog } from './ChangeProfilePictureDialog';

const ProfilePicture = ({
    creatorId,
    profilePicture,
    router,
}: {
    creatorId: string;
    profilePicture: boolean;
    router?: any;
}) => {
    return (
        <div className="relative inline-block">
            <div className="relative">
                {creatorId && profilePicture ? (
                    <Image
                        src={`https://dpehbxmmipfxwdjjmuog.supabase.co/storage/v1/object/public/profile_picture/${creatorId}/avatar?nocache=${Date.now()}`}
                        alt="profile_picture"
                        width={0}
                        height={0}
                        sizes={'1'}
                        className="h-48 w-48 rounded-full shadow-lg"
                        priority
                    />
                ) : (
                    <Image
                        src={'/assets/default-profile-picture.jpg'}
                        alt="profile_picture"
                        width={0}
                        height={0}
                        sizes={'1'}
                        className="h-48 w-48 rounded-full shadow-lg"
                        priority
                    />
                )}
            </div>
            {router && (
                <ChangeProfilePictureDialog
                    router={router}
                    creatorId={creatorId}
                />
            )}
        </div>
    );
};

export default ProfilePicture;
