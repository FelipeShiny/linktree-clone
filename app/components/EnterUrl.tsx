
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface EnterUrlProps {
    onAddLink: (title: string, url: string) => void;
    isLoading?: boolean;
}

const EnterUrl: React.FC<EnterUrlProps> = ({ onAddLink, isLoading = false }) => {
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newTitle || !newTitle.trim()) {
            alert('Por favor, insira um título para o link');
            return;
        }
        
        if (!newUrl || !newUrl.trim()) {
            alert('Por favor, insira uma URL válida');
            return;
        }

        // Validar URL
        try {
            new URL(newUrl.trim());
        } catch {
            alert('Por favor, insira uma URL válida (ex: https://example.com)');
            return;
        }

        onAddLink(newTitle.trim(), newUrl.trim());
        setNewTitle('');
        setNewUrl('');
    };

    return (
        <div className="mt-8 rounded-2xl border bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold">Adicionar Novo Link</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Título
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        placeholder="Ex: Meu Instagram"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        URL
                    </label>
                    <input
                        type="url"
                        id="url"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        placeholder="https://instagram.com/meuusuario"
                        disabled={isLoading}
                    />
                </div>
                <Button 
                    type="submit" 
                    disabled={isLoading || !newTitle.trim() || !newUrl.trim()}
                    className="w-full"
                >
                    {isLoading ? 'Adicionando...' : 'Adicionar Link'}
                </Button>
            </form>
        </div>
    );
};

export default EnterUrl;
