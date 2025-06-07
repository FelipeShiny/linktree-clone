
'use client';

import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../interfaces/AuthStore';
import { getUser, updateProfile, getProfileByUserId } from '../utils/profile';
import { createBrowserClient } from '@supabase/ssr';
import EditableLinkItem from '../components/EditableLinkItem';
import EnterUrl from '../components/EnterUrl';
import ChangeProfilePictureDialog from '../components/ChangeProfilePictureDialog';
import ProfilePicture from '../components/ProfilePicture';
import { Link } from '../types/linkTypes';

interface Profile {
    id: string;
    username: string;
    full_name: string;
    bio: string;
    avatar_url: string;
}

const Admin = observer(() => {
    const [profileData, setProfileData] = useState<Profile>({
        id: '',
        username: '',
        full_name: '',
        bio: '',
        avatar_url: ''
    });
    const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const user = await getUser();
            
            if (user) {
                authStore.setUser(user);
                
                // Load profile data
                const profile = await getProfileByUserId(user.id);
                if (profile) {
                    setProfileData({
                        id: profile.id,
                        username: profile.username || '',
                        full_name: profile.full_name || '',
                        bio: profile.bio || '',
                        avatar_url: profile.avatar_url || ''
                    });
                }

                // Load user's links
                const { data: links, error } = await supabase
                    .from('links')
                    .select('*')
                    .eq('creator_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching links:', error);
                } else {
                    setCreatorLinks(links || []);
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            setMessage('');

            // Validate required fields
            if (!profileData.username.trim()) {
                setMessage('Nome de usuário é obrigatório');
                return;
            }

            // Check if username is unique (if changed)
            const { data: existingUser } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', profileData.username.trim())
                .neq('id', profileData.id)
                .single();

            if (existingUser) {
                setMessage('Este nome de usuário já está em uso');
                return;
            }

            // Update profile
            const success = await updateProfile(profileData.id, {
                username: profileData.username.trim(),
                full_name: profileData.full_name.trim(),
                bio: profileData.bio.trim()
            });

            if (success) {
                setMessage('Perfil atualizado com sucesso!');
                setEditingProfile(false);
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Erro ao atualizar perfil');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage('Erro ao salvar perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingProfile(false);
        loadData(); // Reload original data
        setMessage('');
    };

    const handleProfilePictureUpdate = (newAvatarUrl: string) => {
        setProfileData(prev => ({ ...prev, avatar_url: newAvatarUrl }));
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
    }

    if (!authStore.user) {
        return <div className="flex justify-center items-center min-h-screen">Usuário não encontrado</div>;
    }

    return (
        <div className="mx-auto w-[90%] max-w-4xl">
            <h1 className="text-3xl font-bold py-10">Painel Administrativo</h1>
            
            {/* Profile Section */}
            <section className="mb-8 p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Perfil</h2>
                    {!editingProfile && (
                        <button 
                            onClick={() => setEditingProfile(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Editar Perfil
                        </button>
                    )}
                </div>

                {message && (
                    <div className={`mb-4 p-3 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                        <ProfilePicture 
                            src={profileData.avatar_url} 
                            alt="Foto de perfil"
                            size={120}
                            className="mb-2"
                        />
                        <ChangeProfilePictureDialog onUpdate={handleProfilePictureUpdate} />
                    </div>

                    {editingProfile ? (
                        <div className="flex-1 space-y-4">
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
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Conte um pouco sobre você"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                                >
                                    {saving ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button 
                                    onClick={handleCancelEdit}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <div className="mb-2">
                                <span className="font-medium">Usuário:</span> {profileData.username || 'Não informado'}
                            </div>
                            <div className="mb-2">
                                <span className="font-medium">Nome:</span> {profileData.full_name || 'Não informado'}
                            </div>
                            <div>
                                <span className="font-medium">Bio:</span> {profileData.bio || 'Não informada'}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Links Section */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Seus Links</h2>
                
                <div className="space-y-4 mb-6">
                    {creatorLinks.map((link) => (
                        <EditableLinkItem 
                            key={link.id} 
                            link={link} 
                            creatorLinks={creatorLinks}
                            setCreatorLinks={setCreatorLinks}
                        />
                    ))}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Adicionar Novo Link</h3>
                    <EnterUrl 
                        creatorLinks={creatorLinks} 
                        setCreatorLinks={setCreatorLinks} 
                    />
                </div>
            </section>
        </div>
    );
});

export default Admin;
