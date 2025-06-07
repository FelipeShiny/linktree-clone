
'use client';

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { authStore } from '../interfaces/AuthStore';
import { getUser, getProfileByUserId, updateProfile, Profile } from '../utils/profile';
import ProfilePicture from '../components/ProfilePicture';
import ChangeProfilePictureDialog from '../components/ChangeProfilePictureDialog';

const AdminPage = observer(() => {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<Partial<Profile>>({
        username: '',
        full_name: '',
        bio: '',
        avatar_url: ''
    });
    const [editingProfile, setEditingProfile] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const user = await getUser();
            
            if (user) {
                authStore.setUser(user);
                const profile = await getProfileByUserId(user.id);
                
                if (profile) {
                    setProfileData({
                        username: profile.username || '',
                        full_name: profile.full_name || '',
                        bio: profile.bio || '',
                        avatar_url: profile.avatar_url || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            setMessage('Erro ao carregar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            const user = await getUser();
            if (!user) {
                setMessage('Erro: usuário não encontrado');
                return;
            }

            const success = await updateProfile(user.id, profileData);
            if (success) {
                setMessage('Perfil atualizado com sucesso!');
                setEditingProfile(false);
            } else {
                setMessage('Erro ao salvar perfil');
            }
            
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage('Erro ao salvar perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingProfile(false);
        loadUserProfile(); // Reload original data
    };

    const handleProfilePictureUpdate = (newAvatarUrl: string) => {
        setProfileData(prev => ({ ...prev, avatar_url: newAvatarUrl }));
        setMessage('Foto de perfil atualizada com sucesso!');
        setTimeout(() => setMessage(''), 3000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Carregando...</div>
            </div>
        );
    }

    if (!authStore.isAuthenticated) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Você precisa estar logado para acessar esta página.</div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-[90%] max-w-4xl">
            <h1 className="text-3xl font-bold py-10">Painel Administrativo</h1>
            
            {/* Message Display */}
            {message && (
                <div 
                    className={`mb-4 p-3 rounded ${
                        message.includes('sucesso') || message.includes('atualizada') 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                >
                    {message}
                </div>
            )}

            {/* Profile Section */}
            <section className="mb-8 p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Perfil</h2>
                    {!editingProfile && (
                        <button 
                            onClick={() => setEditingProfile(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Editar Perfil
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center space-y-4">
                        <ProfilePicture
                            src={profileData.avatar_url}
                            alt="Foto de perfil"
                            size={120}
                        />
                        <ChangeProfilePictureDialog onImageUpdate={handleProfilePictureUpdate} />
                    </div>

                    {/* Profile Form */}
                    <div className="flex-1 space-y-4">
                        {editingProfile ? (
                            <div className="space-y-4">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome de Usuário
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.username || ''}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="seu_usuario"
                                    />
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.full_name || ''}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Seu Nome Completo"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Biografia
                                    </label>
                                    <textarea
                                        value={profileData.bio || ''}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="Conte um pouco sobre você..."
                                        maxLength={160}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {(profileData.bio || '').length}/160 caracteres
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                                    >
                                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={saving}
                                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
                                    <p className="text-lg">@{profileData.username || 'Não definido'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                    <p className="text-lg">{profileData.full_name || 'Não definido'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Biografia</label>
                                    <p className="text-lg">{profileData.bio || 'Nenhuma biografia definida'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Links Management Section */}
            <section className="mb-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Gerenciar Links</h2>
                <p className="text-gray-600">
                    Funcionalidade de gerenciamento de links será implementada em breve.
                </p>
            </section>
        </div>
    );
});

export default AdminPage;
