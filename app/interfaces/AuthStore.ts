import { makeObservable, observable, action, runInAction } from 'mobx';
import supabase from '../utils/supabaseClient';
import Cookies from 'js-cookie';

class AuthStore {
    isAuthenticated: boolean = false;
    authUserId?: string = '';
    authEmail?: string = '';
    authUsername?: string = '';

    constructor() {
        makeObservable(this, {
            isAuthenticated: observable,
            authUserId: observable,
            authEmail: observable,
            authUsername: observable,
            handleSignOut: action,
            createUser: action,
            getAuthUser: action,
            signInWithEmail: action,
            signUpWithEmail: action,
        });

        // Initialize observables from cookies if they exist
        this.isAuthenticated = Cookies.get('isAuthenticated') === 'true';
        this.authUserId = Cookies.get('authUserId') || '';
        this.authEmail = Cookies.get('authEmail') || '';
        this.authUsername = Cookies.get('authUsername') || '';
    }

    async getAuthUser() {
        const user = await supabase.auth.getUser();
        const userData = user.data.user;

        if (userData) {
            const loggedInUserId = userData?.id;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', loggedInUserId);
                if (error) throw error;

                runInAction(() => {
                    this.isAuthenticated = true;
                    this.authUserId = loggedInUserId;
                    this.authEmail = userData?.email;
                    this.authUsername = data[0]?.username;
                });

                Cookies.set('authUsername', data[0]?.username);
            } catch (error) {
                console.log(
                    'Error fetching username of logged in user: ',
                    error,
                );
            }
        }
    }

    async signInWithEmail(email: string, password: string) {
        try {
            const resp = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (resp.error) {
                throw resp.error;
            }

            const userId = resp.data.user?.id;
            runInAction(() => {
                this.getAuthUser();
                this.authUserId = userId;
                this.isAuthenticated = true;
                Cookies.set('isAuthenticated', 'true');
                Cookies.set('authUserId', userId);
                Cookies.set('authEmail', email);
            });
        } catch (error) {
            console.log('Login error:', error);
            throw error;
        }
    }

    handleSignOut = async () => {
        runInAction(() => {
            this.isAuthenticated = false;
            this.authUserId = '';
            this.authUsername = '';
            this.authEmail = '';
        });

        Cookies.remove('isAuthenticated');
        Cookies.remove('authUserId');
        Cookies.remove('authEmail');
        Cookies.remove('authUsername');

        await supabase.auth.signOut();
    };

    async signUpWithEmail(email: string, password: string, username: string) {
        try {
            const resp = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if (resp.error) throw resp.error;
            const userId = resp.data.user?.id;
            if (userId) {
                await this.createUser(userId, username);
                this.getAuthUser();
            }
        } catch (error) {
            console.log('Signup error:', error);
            throw error;
        }
    }

    async createUser(userId: string, username: string) {
        try {
            const { error } = await supabase
                .from('profiles')
                .insert({ id: userId, username: username });
            if (error) throw error;
        } catch (error) {
            console.log('Create user error: ', error);
            throw error;
        }
    }
}

const authStore = new AuthStore();
export default authStore;
