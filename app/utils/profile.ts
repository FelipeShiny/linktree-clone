import AuthStore from '../interfaces/AuthStore';
import { Link } from '../types/linkTypes';
import supabase from './supabaseClient'; // Garanta que esta importação esteja presente e correta.

export const addNewLink = async (
    newTitle: string,
    newUrl: string,
    creatorLinks: Link[],
    setNewTitle: React.Dispatch<React.SetStateAction<string>>,
    setNewUrl: React.Dispatch<React.SetStateAction<string>>,
    setCreatorLinks: React.Dispatch<React.SetStateAction<Link[]>>,
) => {
    try {
        if (
            newTitle.trim() !== '' &&
            newUrl.trim() !== '' &&
            AuthStore.authUserId
        ) {
            const { data, error } = await supabase
                .from('links')
                .insert({
                    title: newTitle,
                    url: newUrl,
                    user_id: AuthStore.authUserId,
                })
                .select();
            if (error)
                throw new Error(`Error inserting link: ${error.message}`);
            console.log('New link successfully created: ', data);
            if (creatorLinks && data) {
                setCreatorLinks([...creatorLinks, ...data]);
            }
            setNewTitle('');
            setNewUrl('');
        } else {
            throw new Error('Title, URL, ou user ID está faltando ou é inválido.');
        }
    } catch (error) {
        console.error('Erro ao criar novo link: ', error);
    }
};

// Upload da foto de perfil com tratamento robusto
export const uploadProfilePicture = async (
    creatorId: string,
    file: File,
    router: any,
) => {
    try {
        console.log('Iniciando upload da foto de perfil para:', creatorId);
        
        const filePath = `${creatorId}/avatar`;

        // 1. Upload da imagem no Storage com upsert
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (uploadError) {
            console.error('Erro no upload:', uploadError);
            throw new Error(`Falha no upload: ${uploadError.message}`);
        }
        
        console.log('Upload realizado com sucesso:', uploadData);

        // 2. Gerar URL pública
        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;
        console.log('URL pública gerada:', publicUrl);

        // 3. Atualizar a tabela profiles
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', creatorId);

        if (updateError) {
            console.error('Erro ao atualizar perfil:', updateError);
            throw new Error(`Falha ao atualizar perfil: ${updateError.message}`);
        }

        console.log('Perfil atualizado com sucesso no banco de dados');
        
        return publicUrl;

    } catch (error) {
        console.error('Erro completo no processo de upload:', error);
        throw error;
    }
};

// **CORRIGIDO:** A tabela deve ser 'profiles' para buscar o ID do criador.
export const fetchCreatorId = async (creatorSlug: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles') // <-- CORRIGIDO
            .select('id')
            .eq('username', creatorSlug)
            .single();

        if (error) {
            // Não loga erro se for 'No rows found', pois isso é esperado se o perfil não existe.
            if (error.code !== 'PGRST116') {
                console.error('Erro ao buscar ID do criador:', error.message);
            }
            return null;
        }

        return data?.id || null;
    } catch (error) {
        console.error('Erro em fetchCreatorId:', error);
        return null;
    }
};

export const fetchCreatorData = async (creatorSlug: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', creatorSlug)
            .single();

        if (error) {
            if (error.code !== 'PGRST116') {
                 console.error('Erro ao buscar dados do criador:', error.message);
            }
            return null;
        }

        return data;
    } catch (error) {
        console.error('Erro em fetchCreatorData:', error);
        return null;
    }
};

// Função para gerar URL da imagem de perfil com bust de cache
export const getProfilePictureUrl = (creatorId: string, forceRefresh: boolean = false) => {
    if (!creatorId) {
        console.log('CreatorId não fornecido, usando imagem padrão');
        return '/assets/default-profile-picture.jpg';
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
        console.error('NEXT_PUBLIC_SUPABASE_URL não configurada');
        return '/assets/default-profile-picture.jpg';
    }
    
    // Adicionar timestamp para quebrar cache
    const timestamp = forceRefresh ? Date.now() : '';
    const cacheParam = timestamp ? `?v=${timestamp}` : '';
    const url = `${supabaseUrl}/storage/v1/object/public/avatars/${creatorId}/avatar${cacheParam}`;
    
    console.log('URL da imagem gerada:', url);
    return url;
};

// Função para buscar dados do perfil incluindo avatar_url
export const fetchProfileWithAvatar = async (creatorId: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .eq('id', creatorId)
            .single();

        if (error) {
            console.error('Erro ao buscar perfil:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Erro em fetchProfileWithAvatar:', error);
        return null;
    }
};

export const fetchLinks = async (
    creatorId: string,
    setCreatorLinks: React.Dispatch<React.SetStateAction<Link[]>>,
    setIsLinkLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    try {
        const { data: linksData, error: linksError } = await supabase
            .from('links')
            .select('id, title, url, show')
            .eq('user_id', creatorId)
            .order('created_at', { ascending: true }); // Adicionado para ordem consistente

        if (linksError) throw linksError;

        setCreatorLinks(linksData || []);
        setIsLinkLoading(false);
    } catch (error) {
        console.error('Erro ao buscar links:', error);
        setIsLinkLoading(false);
    }
};

// **DEPRECADO/REMOVIDO:** A função 'fetchProfilePicture' foi integrada na lógica de
// 'fetchCreatorData' e a URL é obtida via 'getProfilePictureUrl'
// ou diretamente da coluna 'avatar_url' da tabela 'profiles'.
// Manter a função antiga pode causar confusão.

export const updateLinkTitle = async (linkId: number, newTitle: string) => {
    try {
        const { error } = await supabase
            .from('links')
            .update({ title: newTitle })
            .eq('id', linkId);
        if (error) throw error;
    } catch (error) {
        console.error('Erro ao atualizar título do link:', error);
    }
};

export const updateLinkUrl = async (urlId: number, newUrl: string) => {
    try {
        const { error } = await supabase
            .from('links')
            .update({ url: newUrl })
            .eq('id', urlId);
        if (error) throw error;
    } catch (error) {
        console.error('Erro ao atualizar URL do link:', error);
    }
};

export const updateShowLink = async (linkId: number) => {
    try {
        const { data: linkData, error: fetchError } = await supabase
            .from('links')
            .select('show')
            .eq('id', linkId)
            .single();

        if (fetchError) throw fetchError;

        const currentShowValue = linkData?.show;

        const { error: updateError } = await supabase
            .from('links')
            .update({ show: !currentShowValue })
            .eq('id', linkId);

        if (updateError) throw updateError;

        console.log('Visibilidade do link atualizada com sucesso.');
    } catch (error) {
        console.error('Não foi possível mudar o estado de visibilidade:', error);
    }
};

export const deleteLink = async (linkId: number) => {
    try {
        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', linkId)
            .select();
        if (error) throw error;
    } catch (error) {
        console.error('Erro ao deletar link:', error);
    }
};