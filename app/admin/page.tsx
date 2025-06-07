    'use client';

    import React, { useState, useEffect } from 'react';
    import { observer } from 'mobx-react';
    import { authStore } from '../interfaces/AuthStore';
    import { getUser, getProfileByUserId, updateProfile, Profile } from '../utils/profile';
    import ProfilePicture from '../components/ProfilePicture';
    import ChangeProfilePictureDialog from '../components/ChangeProfilePictureDialog';
    import { useRouter } from 'next/navigation'; // Adicionado: router para redirecionamento
    import { fetchLinks } from '../utils/profile'; // Adicionado: para buscar links
    import { Link } from '../types/linkTypes'; // Adicionado: para tipos de links
    import EnterUrl from '../components/EnterUrl'; // Adicionado: para adicionar links
    import EditableLinkItem from '../components/EditableLinkItem'; // Adicionado: para links editáveis

    const AdminPage = observer(() => {
        const router = useRouter(); // Inicializar router aqui

        const [profile, setProfile] = useState<Profile | null>(null);
        const [loading, setLoading] = useState(true);
        const [saving, setSaving] = useState(false);
        const [message, setMessage] = useState<string>('');
        const [formData, setFormData] = useState({
            username: '',
            full_name: '',
            bio: ''
        });

        // Adicionado: Estados para os links
        const [creatorLinks, setCreatorLinks] = useState<Link[]>([]);
        const [isLinkLoading, setIsLinkLoading] = useState<boolean>(true);
        // Adicionado: Estados para o EnterUrl
        const [newUrl, setNewUrl] = useState<string>('');
        const [newTitle, setNewTitle] = useState<string>('');

        // --- Lógica de Carregamento do Perfil ---
        useEffect(() => {
            const loadProfileData = async () => {
                try {
                    // 1. Tentar obter o usuário da sessão
                    const user = await getUser();
                    if (!user) {
                        // Se não houver usuário logado, redireciona para o login
                        router.push('/login');
                        return; // Importante para parar a execução
                    }
                    authStore.setUser(user); // Define o usuário na store

                    // 2. Tentar obter os dados do perfil
                    const fetchedProfile = await getProfileByUserId(user.id);

                    if (fetchedProfile) {
                        setProfile(fetchedProfile);
                        setFormData({
                            username: fetchedProfile.username || '',
                            full_name: fetchedProfile.full_name || '',
                            bio: fetchedProfile.bio || ''
                        });
                    } else {
                        // Se o perfil não for encontrado, pode ser um erro ou precisa criar um
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
        }, [router]); // Dependência do router para garantir que o redirecionamento funcione

        // --- Lógica de Carregamento de Links (depende do profile.id) ---
        useEffect(() => {
            if (profile?.id) { // Carrega links apenas se o profile.id estiver disponível
                fetchLinks(profile.id, setCreatorLinks, setIsLinkLoading);
            }
        }, [profile?.id, setCreatorLinks, setIsLinkLoading]);


        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSaveProfile = async () => {
            if (!authStore.user || !profile?.id) { // Verificar se o user e profile.id existem
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

                const success = await updateProfile(authStore.user.id, updates); // updateProfile retorna boolean

                if (success) {
                    setProfile(prev => (prev ? { ...prev, ...updates } : null)); // Atualiza o estado local do perfil
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
            // Esta função é chamada pelo ChangeProfilePictureDialog após o upload
            setProfile(prev => {
                if (prev) {
                    return { ...prev, avatar_url: newAvatarUrl };
                }
                return prev;
            });
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

        // if (!authStore.user) já é tratado no primeiro useEffect com redirecionamento

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
                            // Passando profile.avatar_url, userId e um setter
                            // O componente ProfilePicture agora é responsável por carregar a imagem
                            userId={profile?.id || ''} // Passar o ID do usuário
                            avatarUrl={profile?.avatar_url} // Passar a URL do avatar do perfil
                            size={120} // Tamanho fixo para o exemplo
                        />
                        {/* ChangeProfilePictureDialog é o modal para escolher e enviar a nova foto */}
                        <ChangeProfilePictureDialog
                            userId={authStore.user?.id || ''} // Passar o ID do usuário logado
                            onImageUpdate={handleProfilePictureUpdate} // Callback para atualizar a UI após upload
                            // As props isOpen e onClose serão gerenciadas pelo ProfilePicture ou por um estado aqui
                            // A IA reescreveu este componente, então a forma de abri-lo pode ter mudado.
                            // Se o dialog não abrir, precisaremos adicionar um estado para controlá-lo (isOpen, setIsOpen)
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