import { makeAutoObservable } from 'mobx';
import { User } from '@supabase/supabase-js';

class AuthStore {
    user: User | null = null;
    isAuthenticated: boolean = false;
    loading: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: User | null) {
        this.user = user;
        this.isAuthenticated = !!user;
        this.loading = false;
    }

    logout() {
        this.user = null;
        this.isAuthenticated = false;
    }

    setLoading(loading: boolean) {
        this.loading = loading;
    }

    async login(email: string, password: string) {
        try {
            const {createBrowserClient} = await import('@supabase/ssr');
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.setUser(data.user);
            console.log('Logged in');
            return { success: true, message: 'Login realizado com sucesso!' };
        } catch (error: any) {
            console.error('Login error:', error);
            return { success: false, message: error.message || 'E-mail/senha incorretos' };
        }
    }

    async signup(email: string, password: string, username: string, fullName: string) {
        try {
            const {createBrowserClient} = await import('@supabase/ssr');
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        full_name: fullName
                    }
                }
            });

            if (error) throw error;

            return { success: true, message: 'Cadastro realizado com sucesso! Verifique seu e-mail.' };
        } catch (error: any) {
            console.error('Signup error:', error);
            return { success: false, message: error.message || 'Erro ao cadastrar' };
        }
    }

    async logoutSupabase() {
        try {
            const {createBrowserClient} = await import('@supabase/ssr');
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            await supabase.auth.signOut();
            this.logout();
            return { success: true, message: 'Logout realizado com sucesso!' };
        } catch (error: any) {
            console.error('Logout error:', error);
            return { success: false, message: 'Erro ao fazer logout' };
        }
    }

    async initializeAuth() {
        try {
            const {createBrowserClient} = await import('@supabase/ssr');
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            this.setUser(user);
        } catch (error) {
            console.error('Error initializing auth:', error);
        } finally {
            this.setLoading(true);
        }
    }
}

export const authStore = new AuthStore();
export default AuthStore;