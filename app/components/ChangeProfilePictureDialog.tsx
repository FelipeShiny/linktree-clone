'use client';

import React, { useState } from 'react';
import { uploadProfilePicture, getUser } from '../utils/profile';
import { authStore } from '../interfaces/AuthStore';

interface ChangeProfilePictureDialogProps {
    onUpdate?: (newAvatarUrl: string) => void;
}

const ChangeProfilePictureDialog: React.FC<ChangeProfilePictureDialogProps> = ({ onUpdate }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Selecione uma imagem primeiro.');
            return;
        }

        if (!authStore.user) {
            setMessage('Usuário não autenticado.');
            return;
        }

        try {
            setUploading(true);
            setMessage('Enviando imagem...');

            // Upload the file
            const avatarUrl = await uploadProfilePicture(authStore.user.id, selectedFile);

            if (!avatarUrl) {
                setMessage('Erro no upload da imagem.');
                return;
            }

            // Update profile with new avatar URL
            const success = await updateProfile(authStore.user.id, { avatar_url: avatarUrl });

            if (success) {
                setMessage('Foto atualizada com sucesso!');
                onUpdate?.(avatarUrl);
                setSelectedFile(null);

                // Clear message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Erro ao salvar no perfil.');
            }
        } catch (error) {
            console.error('Error uploading:', error);
            setMessage('Erro inesperado no upload.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            {selectedFile && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {uploading ? 'Enviando...' : 'Alterar Foto'}
                </button>
            )}

            {message && (
                <div className={`p-2 rounded text-sm ${
                    message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default ChangeProfilePictureDialog;