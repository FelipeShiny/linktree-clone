
'use client';

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { authStore } from '../interfaces/AuthStore';
import { getUser, getProfileByUserId, updateProfile, Profile } from '../utils/profile';
import ProfilePicture from '../components/ProfilePicture';
import ChangeProfilePictureDialog from '../components/ChangeProfilePictureDialog';

const AdminPage = observer(() => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        bio: ''
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = await getUser();
                if (user) {
                    authStore.setUser(user);
                    const { data: profileData } = await getProfileByUserId(user.id);
                    if (profileData) {
                        setProfile(profileData);
                        setFormData({
                            username: profileData.username || '',
                            full_name: profileData.full_name || '',
                            bio: profileData.bio || ''
                        });
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                setMessage('Erro ao carregar dados do perfil.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        if (!authStore.user || !profile) return;

        setSaving(true);
        setMessage('');

        try {
            const updates = {
                username: formData.username.trim(),
                full_name: formData.full_name.trim(),
                bio: formData.bio.trim()
            };

            const { data, error } = await updateProfile(authStore.user.id, updates);

            if (error) {
                if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
                    setMessage('Este nome de usuário já está em uso. Escolha outro.');
                } else {
                    setMessage('Erro ao salvar perfil. Tente novamente.');
                }
                return;
            }

            setProfile({ ...profile, ...updates });
            setMessage('Perfil salvo com sucesso!');
            
            // Limpar mensagem após 3 segundos
            setTimeout(() => setMessage(''), 3000);

        } catch (error: any) {
            console.error('Erro ao salvar perfil:', error);
            setMessage('Erro ao salvar perfil. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Carregando...</div>
            </div>
        );
    }

    if (!authStore.user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Você precisa estar logado para acessar esta página.</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Configurações do Perfil</h1>
            
            {/* Seção da Foto de Perfil */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Foto de Perfil</h2>
                <div className="flex flex-col items-center space-y-4">
                    <ProfilePicture 
                        profile={profile} 
                        size="large"
                        className="w-32 h-32"
                    />
                    <ChangeProfilePictureDialog userId={authStore.user.id} />
                </div>
            </div>

            {/* Seção de Informações do Perfil */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Informações do Perfil</h2>
                
                <div className="space-y-4">
                    {/* Nome de Usuário */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome de Usuário *
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Seu nome de usuário único"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Este será usado na URL do seu perfil: /{formData.username}
                        </p>
                    </div>

                    {/* Nome Completo */}
                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Seu nome completo"
                        />
                    </div>

                    {/* Biografia */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                            Biografia
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            placeholder="Conte um pouco sobre você..."
                            maxLength={300}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.bio.length}/300 caracteres
                        </p>
                    </div>

                    {/* Botão Salvar */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSaveProfile}
                            disabled={saving || !formData.username.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {saving ? 'Salvando...' : 'Salvar Perfil'}
                        </button>
                    </div>

                    {/* Mensagem de Feedback */}
                    {message && (
                        <div className={`p-3 rounded-md text-sm ${
                            message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>

            {/* Link para o Perfil Público */}
            {profile?.username && (
                <div className="mt-6 text-center">
                    <a
                        href={`/${profile.username}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Ver seu perfil público: /{profile.username}
                    </a>
                </div>
            )}
        </div>
    );
});

export default AdminPage;
