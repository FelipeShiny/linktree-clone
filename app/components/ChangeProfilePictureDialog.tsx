'use client';

import React, { useState } from 'react';
import { observer } from 'mobx-react';
import AuthStore from '../interfaces/AuthStore';
import { uploadProfilePicture } from '../utils/profile';
import { useRouter } from 'next/navigation';
import { Camera, Upload } from 'lucide-react';

interface ChangeProfilePictureDialogProps {
    setProfilePicture: React.Dispatch<React.SetStateAction<string>>;
}

const ChangeProfilePictureDialog = observer(({ setProfilePicture }: ChangeProfilePictureDialogProps) => {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !AuthStore.authUserId) return;

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione um arquivo de imagem.');
            return;
        }

        // Validar tamanho do arquivo (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('O arquivo deve ter no máximo 5MB.');
            return;
        }

        setIsUploading(true);

        try {
            await uploadProfilePicture(AuthStore.authUserId, file, router);
            // Atualizar a foto de perfil no estado local
            const newProfilePictureUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${AuthStore.authUserId}/avatar?nocache=${Date.now()}`;
            setProfilePicture(newProfilePictureUrl);
        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            alert('Erro ao fazer upload da foto. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="relative">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploading}
                id="profile-picture-upload"
            />
            <label 
                htmlFor="profile-picture-upload"
                className={`flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Camera size={16} />
                )}
            </label>
        </div>
    );
});

export default ChangeProfilePictureDialog;