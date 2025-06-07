'use client';

import React, { useState, useEffect } from 'react';
import AuthStore from '../interfaces/AuthStore';
import { useRouter } from 'next/navigation';
import { fetchLinks, getProfilePictureUrl } from '../utils/profile';
import supabase from '../utils/supabaseClient';
import { Link } from '../types/linkTypes';
import { Eye } from 'lucide-react';
import NextLink from 'next/link';
import EnterUrl from '../components/EnterUrl';
import EditableLinkItem from '../components/EditableLinkItem';
import { ChangeProfilePictureDialog } from '../components/ChangeProfilePictureDialog';
import ProfilePicture from '../components/ProfilePicture';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [creatorId, setCreatorId] = useState<string>('');
    const [creatorUsername, setCreatorUsername] = useState<string | undefined>(
        '',
    );

    // Adicionado: Estados para o novo link (URL e Título)
    const [newUrl, setNewUrl] = useState<string>('');
    const [newTitle, setNewTitle] = useState<string>('');

    // check authentication
    const router = useRouter();

    useEffect(() => {
        if (AuthStore.authUserId) {
            setIsAuthenticated(true);
            setCreatorId(AuthStore.authUserId);
            setCreatorUsername(AuthStore.authUsername);
        } else {
            router.push('/login');
        }
    }, [router]);

    const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
    const [profilePicture, setProfilePicture] = useState<string>('');
    const [isLinkLoading, setIsLinkLoading] = useState<boolean>(false);

    const [profileData, setProfileData] = useState({
        username: '',
        full_name: '',
        bio: ''
    });

    const [originalProfileData, setOriginalProfileData] = useState({
        username: '',
        full_name: '',
        bio: ''
    });

    const [editingProfile, setEditingProfile] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update(profileData)
                .eq('id', creatorId);

            if (error) {
                throw error;
            }

            setOriginalProfileData({...profileData});
            setEditingProfile(false);
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleCancelEdit = () => {
        setProfileData({...originalProfileData});
        setEditingProfile(false);
    };

    useEffect(() => {
        if (creatorId) {
            fetchLinks(creatorId, setCreatorLinks, setIsLinkLoading);

            // Buscar dados do perfil incluindo avatar_url
            const loadProfileData = async () => {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('avatar_url, username, full_name, bio')
                        .eq('id', creatorId)
                        .single();

                    if (data) {
                        setProfilePicture(data.avatar_url || '');
                        setProfileData({
                            username: data.username || '',
                            full_name: data.full_name || '',
                            bio: data.bio || ''
                        });
                        setOriginalProfileData({
                            username: data.username || '',
                            full_name: data.full_name || '',
                            bio: data.bio || ''
                        });
                    }
                } catch (error) {
                    console.error('Error loading profile data:', error);
                }
            };

            loadProfileData();
        }
    }, [creatorId]);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <NextLink
                    href={`/${creatorUsername || creatorId}`}
                    className="flex items-center text-blue-600 hover:underline"
                >
                    <Eye className="h-5 w-5 mr-1" /> View Public Page
                </NextLink>
            </header>

            <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                <div className="flex items-center space-x-4">
                    <ProfilePicture 
                        creatorId={creatorId} 
                        profilePicture={profilePicture}
                        setProfilePicture={setProfilePicture}
                        router={router}
                    />
                    <div>
                        <p className="text-lg font-medium">@{creatorUsername || creatorId}</p>
                    </div>
                </div>
            </section>

            <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Links</h2>
                <EnterUrl
                    newUrl={newUrl} // Adicionado
                    setNewUrl={setNewUrl} // Adicionado
                    newTitle={newTitle} // Adicionado
                    setNewTitle={setNewTitle} // Adicionado
                    creatorLinks={creatorLinks}
                    setCreatorLinks={setCreatorLinks}
                />
                {isLinkLoading ? (
                    <p className="text-center text-gray-500">Loading links...</p>
                ) : creatorLinks.length === 0 ? (
                    <p className="text-center text-gray-500">No links added yet.</p>
                ) : (
                    <div className="space-y-4 mt-4">
                        {creatorLinks.map((link) => (
                            <EditableLinkItem
                                key={link.id}
                                link={link}
                                creatorLinks={creatorLinks}
                                setCreatorLinks={setCreatorLinks}
                            />
                        ))}
                    </div>
                )}
            </section>
             <section className="p-6 bg-white rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                 <div className="flex items-center space-x-4">
                    <ChangeProfilePictureDialog />
                </div>

                {/* Profile Edit Section */}
                <div className="mx-auto w-[90%] max-w-[400px] pt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Informações do Perfil</h3>
                        {!editingProfile && (
                            <button 
                                onClick={() => setEditingProfile(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm"
                            >
                                Editar
                            </button>
                        )}
                    </div>

                    {editingProfile ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome de Usuário</label>
                                <input
                                    type="text"
                                    value={profileData.username}
                                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Seu nome de usuário"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    value={profileData.full_name}
                                    onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Seu nome completo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Biografia</label>
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg h-20 resize-none"
                                    placeholder="Conte um pouco sobre você"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSavingProfile}
                                    className="flex-1 bg-green-500 text-white py-2 rounded-full disabled:opacity-50"
                                >
                                    {isSavingProfile ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-gray-500 text-white py-2 rounded-full"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div>
                                <span className="font-medium">Usuário:</span> {profileData.username || 'Não informado'}
                            </div>
                            <div>
                                <span className="font-medium">Nome:</span> {profileData.full_name || 'Não informado'}
                            </div>
                            <div>
                                <span className="font-medium">Bio:</span> {profileData.bio || 'Não informada'}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Admin;