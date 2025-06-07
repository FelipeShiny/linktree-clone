'use client';

import React, { useState } from 'react';
import { addNewLink, getUser } from '../utils/profile';
import { Link } from '../types/linkTypes';

interface EnterUrlProps {
    setCreatorLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

const EnterUrl: React.FC<EnterUrlProps> = ({ setCreatorLinks }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>('');

    const handleAddLink = async () => {
        if (!title.trim() || !url.trim()) {
            setMessage('Preencha título e URL.');
            return;
        }

        try {
            setAdding(true);
            setMessage('Adicionando link...');

            const user = await getUser();
            if (!user) {
                setMessage('Usuário não autenticado.');
                return;
            }

            const newLink = await addNewLink(user.id, title.trim(), url.trim());

            if (newLink) {
                setCreatorLinks(prev => [...prev, newLink]);
                setTitle('');
                setUrl('');
                setMessage('Link adicionado com sucesso!');

                // Clear message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Erro ao adicionar link.');
            }
        } catch (error) {
            console.error('Error adding link:', error);
            setMessage('Erro ao adicionar link.');
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="space-y-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">Adicionar Novo Link</h3>

            <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título do link"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://exemplo.com"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>

            <button
                onClick={handleAddLink}
                disabled={adding}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {adding ? 'Adicionando...' : 'Adicionar Link'}
            </button>

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

export default EnterUrl;