
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogClose } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { createBrowserClient } from '@supabase/ssr';
import { authStore } from '../interfaces/AuthStore';
import { updateProfile } from '../utils/profile';

interface ChangeProfilePictureDialogProps {
    onUpdate?: (newAvatarUrl: string) => void;
}

const ChangeProfilePictureDialog: React.FC<ChangeProfilePictureDialogProps> = ({ onUpdate }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setMessage('Arquivo muito grande. Máximo 5MB.');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setMessage('Por favor, selecione uma imagem.');
                return;
            }
            setSelectedFile(file);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !authStore.user) {
            setMessage('Selecione um arquivo primeiro.');
            return;
        }

        try {
            setUploading(true);
            setMessage('');

            // Create unique filename
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `avatar_${authStore.user.id}_${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, selectedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                setMessage('Erro no upload: ' + uploadError.message);
                return;
            }

            // Get public URL with proper domain
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            if (!urlData?.publicUrl) {
                setMessage('Erro ao obter URL da imagem.');
                return;
            }

            // Ensure URL uses correct domain
            const correctUrl = urlData.publicUrl.replace(
                /https:\/\/[^\/]+/,
                process.env.NEXT_PUBLIC_SUPABASE_URL!
            );

            // Update profile in database
            const success = await updateProfile(authStore.user.id, {
                avatar_url: correctUrl
            });

            if (success) {
                setMessage('Foto atualizada com sucesso!');
                onUpdate?.(correctUrl);
                setSelectedFile(null);
                
                // Force reload after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
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
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-2 text-sm">
                    Alterar Foto
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <h3 className="text-lg font-semibold">Alterar Foto de Perfil</h3>
                </DialogHeader>
                
                <div className="space-y-4">
                    {message && (
                        <div className={`p-3 rounded text-sm ${
                            message.includes('sucesso') 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Selecionar Nova Foto
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        
                        {selectedFile && (
                            <div className="text-sm text-gray-600 mt-2">
                                Selecionado: {selectedFile.name}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                        <DialogClose asChild>
                            <Button variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button 
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                        >
                            {uploading ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeProfilePictureDialog;
