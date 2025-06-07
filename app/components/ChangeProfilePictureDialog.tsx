
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogClose,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil, X, Upload } from 'lucide-react';
import { uploadProfilePicture } from '../utils/profile';

export function ChangeProfilePictureDialog({
    creatorId,
    router,
    setProfilePicture,
}: {
    creatorId: string;
    router: any;
    setProfilePicture: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            await uploadProfilePicture(creatorId, selectedFile, router);
            
            // Atualizar a URL da imagem com timestamp para forçar recarregamento
            const newImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${creatorId}/avatar?nocache=${Date.now()}`;
            setProfilePicture(newImageUrl);
            
            setSelectedFile(undefined);
            
            // Fechar o dialog
            document.querySelector('[data-state="open"]')?.click();
        } catch (error) {
            console.error('Erro no upload:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="absolute bottom-0 right-0 cursor-pointer">
                    <div className="rounded-full bg-white p-2 shadow-lg hover:shadow-xl transition-shadow">
                        <Pencil className="h-6 w-6 text-gray-600" />
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-white py-8 max-w-md">
                <DialogHeader>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Upload Profile Picture</h2>
                        <DialogClose asChild>
                            <Button variant="outline" size="sm">
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogClose>
                    </div>
                    <DialogDescription>
                        Choose a new profile picture to upload.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        
                        {selectedFile && (
                            <div className="text-sm text-gray-600">
                                Selected: {selectedFile.name}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                        onClick={handleUpload} 
                        disabled={!selectedFile || isUploading}
                        className="flex items-center gap-2"
                    >
                        <Upload className="h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
