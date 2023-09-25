import { makeObservable, observable, action, runInAction } from "mobx";
import supabase from "../utils/supabaseClient";

class AuthStore {
    isAuthenticated: boolean = false;
    authUserId?: string = "";
    authEmail?: string = "";
    authUsername?: string = "";

    constructor() {
        makeObservable(this, {
            isAuthenticated: observable,
            authUserId: observable,
            authEmail: observable,
            authUsername: observable,
            getAuthUser: action,
            signInWithEmail: action,
            signUpWithEmail: action,
        });
    }

    async getAuthUser() {
        const user = await supabase.auth.getUser();
        const userData = user.data.user;

        if (userData) {
            const loggedInUserId = userData?.id;

            try {
                const { data, error } = await supabase
                    .from("users")
                    .select("username")
                    .eq("id", loggedInUserId);
                if (error) throw error;

                runInAction(() => {
                    this.isAuthenticated = true;
                    this.authUserId = loggedInUserId;
                    this.authEmail = userData?.email;
                    this.authUsername = data[0]?.username;
                });
            } catch (error) {
                console.log(
                    "Error fetching username of logged in user: ",
                    error
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
            });
        } catch (error) {
            console.log("Login error:", error);
            throw error;
        }
    }

    handleSignOut = async () => {
        runInAction(() => {
            this.isAuthenticated = false;
            this.authUserId = "";
            this.authUsername = "";
            this.authEmail = "";
        });
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
            console.log("Signup error:", error);
            throw error;
        }
    }

    async createUser(userId: string, username: string) {
        try {
            const { error } = await supabase
                .from("users")
                .insert({ id: userId, username: username });
            if (error) throw error;
        } catch (error) {
            console.log("Create user error: ", error);
            throw error;
        }
    }
}

export default new AuthStore();
