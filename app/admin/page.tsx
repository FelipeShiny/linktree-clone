'use client';

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { authStore } from '../interfaces/AuthStore';
import { getUser, getProfileByUserId, updateProfile, Profile } from '../utils/profile';
import ProfilePicture from '../components/ProfilePicture';
import ChangeProfilePictureDialog from '../components/ChangeProfilePictureDialog';
import { useRouter } from 'next/navigation';
import { fetchLinks } from '../utils/profile';
import { Link } from '../types/linkTypes';
import EnterUrl from '../components/EnterUrl';
import EditableLinkItem from '../components/EditableLinkItem';

const AdminPage = observer(() => {
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        bio: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
    const [isLinkLoading, setIsLinkLoading] = useState<boolean>(true);
    const [newUrl, setNewUrl] = useState<string>('');
    const [newTitle, setNewTitle] = useState<string>('');

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const user = await getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }
                authStore.setUser(user);

                const fetchedProfile = await getProfileByUserId(user.id);

                if (fetchedProfile) {
                    setProfile(fetchedProfile);
                    setFormData({
                        username: fetchedProfile.username || '',
                        full_name: fetchedProfile.full_name || '',
                        bio: fetchedProfile.bio || ''
                    });
                } else {
                    console.warn('Profile not found for user:', user.id);
                    setMessage('Perfil não encontrado. Tente novamente mais tarde.');
                }
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                setMessage('Erro ao carregar dados do perfil. Verifique sua conexão.');
            } finally {
                setLoading(false);
            }
        };

        loadProfileData();
    }, [router]);

    useEffect(() => {
        const loadLinks = async () => { // <--- ADICIONADO: Nova função async
            if (profile?.id) {
                setIsLinkLoading(true); // <--- Adicionado: Setar loading antes da busca
                try {
                    const links = await fetchLinks(profile.id); // <--- AGORA APENAS profile.id
                    setCreatorLinks(links); // <--- Setar os links recebidos
                } catch (error) {
                    console.error("Erro ao carregar links:", error); // <--- Melhorar log de erro
                    setCreatorLinks([]); // <--- Limpar links em caso de erro
                } finally {
                    setIsLinkLoading(false); // <--- Setar loading para falso
                }
            }
        };

        loadLinks(); // <--- Chamar a nova função async

    }, [profile?.id]); // <--- DEPENDÊNCIAS MODIFICADAS: apenas profile.id é necessário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        if (!authStore.user || !profile?.id) {
            setMessage('Você precisa estar logado para salvar o perfil.');
            return;
        }

        setSaving(true);
        setMessage('');

        try {
            const updates = {
                username: formData.username.trim(),
                full_name: formData.full_name.trim(),
                bio: formData.bio.trim()
            };

            const success = await updateProfile(authStore.user.id, updates);

            if (success) {
                setProfile(prev => (prev ? { ...prev, ...updates } : null));
                setMessage('Perfil salvo com sucesso!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Erro ao salvar perfil. Nome de usuário pode já estar em uso ou outro erro.');
            }

        } catch (error: any) {
            console.error('Erro ao salvar perfil:', error);
            setMessage('Erro ao salvar perfil. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleProfilePictureUpdate = (newAvatarUrl: string) => {
        setProfile(prev => {
            if (prev) {
                return { ...prev, avatar_url: newAvatarUrl };
            }
            return prev;
        });
        setMessage('Foto de perfil atualizada com sucesso!');
        setTimeout(() => setMessage(''), 3000);
    };

    const refreshLinks = async () => {
        if (profile?.id) {
            setIsLinkLoading(true);
            try {
                const links = await fetchLinks(profile.id);
                setCreatorLinks(links);
            } catch (error) {
                console.error("Erro ao carregar links:", error);
                setCreatorLinks([]);
            } finally {
                setIsLinkLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Configurações do Perfil</h1>

            {message && (
                <div className={`p-3 rounded-md text-sm mb-4 ${
                    message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}

            {/* Seção da Foto de Perfil */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Foto de Perfil</h2>
                <div className="flex flex-col items-center space-y-4">
                    <ProfilePicture
                        userId={profile?.id || ''}
                        avatarUrl={profile?.avatar_url}
                        size={120}
                    />
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Alterar Foto
                    </button>

                    <ChangeProfilePictureDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        userId={authStore.user?.id || ''}
                        onImageUpdate={handleProfilePictureUpdate}
                    />
                </div>
            </div>

            {/* Seção de Informações do Perfil */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
                </div>
            </div>

            {/* Seção de Links */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Gerenciar Links</h2>

                {/* Adicionar novo link */}
                <div className="mb-6">
                    <EnterUrl 
                        creatorId={authStore.user?.id || ''} 
                        onLinkAdded={refreshLinks}
                    />
                </div>

                {/* Lista de links existentes */}
                <div className="space-y-3">
                    {isLinkLoading ? (
                        <div className="text-center">Carregando links...</div>
                    ) : creatorLinks && creatorLinks.length > 0 ? (
                        creatorLinks.map((link: Link) => (
                            <EditableLinkItem
                                key={link.id}
                                link={link}
                                creatorLinks={creatorLinks}
                                setCreatorLinks={setCreatorLinks}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Nenhum link encontrado</p>
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