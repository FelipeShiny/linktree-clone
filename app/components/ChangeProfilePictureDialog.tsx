
'use client';

import React, { useState } from 'react';
import { uploadProfilePicture } from '../utils/profile';

interface ChangeProfilePictureDialogProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onImageUpdate: (newAvatarUrl: string) => void;
}

const ChangeProfilePictureDialog: React.FC<ChangeProfilePictureDialogProps> = ({
    isOpen,
    onClose,
    userId,
    onImageUpdate
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                setMessage('Por favor, selecione um arquivo de imagem.');
                return;
            }
            
            // Validar tamanho (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                setMessage('A imagem deve ter no máximo 5MB.');
                return;
            }
            
            setSelectedFile(file);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Selecione uma imagem primeiro.');
            return;
        }

        setUploading(true);
        setMessage('Enviando...');

        try {
            const avatarUrl = await uploadProfilePicture(userId, selectedFile);
            
            if (avatarUrl) {
                setMessage('Foto atualizada com sucesso!');
                onImageUpdate(avatarUrl);
                
                // Fechar o diálogo após 1 segundo
                setTimeout(() => {
                    onClose();
                    setSelectedFile(null);
                    setMessage('');
                }, 1000);
            } else {
                setMessage('Erro ao fazer upload da imagem.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage('Erro ao fazer upload da imagem.');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Alterar Foto de Perfil</h3>
                
                <div className="space-y-4">
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="w-full"
                            disabled={uploading}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                        </p>
                    </div>

                    {selectedFile && (
                        <div className="text-sm text-gray-600">
                            Arquivo selecionado: {selectedFile.name}
                        </div>
                    )}

                    {message && (
                        <div className={`p-2 rounded text-sm ${
                            message.includes('sucesso') 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Enviando...' : 'Enviar'}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeProfilePictureDialog;
