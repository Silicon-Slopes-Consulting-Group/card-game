import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { firstValueFrom } from "rxjs";
import { User } from "../classes/user";
import { SESSION_TOKEN_KEY } from "../constants/storage";
import { LoadingPage } from "../pages/loading-page/loading-page";
import { apiService } from "../services/api-service";

export interface SessionContextType {
    token: string | undefined;
    user: User | undefined;
    login: (email: string, password: string) => Promise<User>,
    signup: (email: string, password: string) => Promise<User>,
    loadSession: () => Promise<User | undefined>,
    logout: () => void,

    addCardToFavorite: (cardId: string) => Promise<User>,
    deleteCardFromFavorite: (cardId: string) => Promise<User>,
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [token, setToken] = useState<string | undefined>();
    const [user, setUser] = useState<User | undefined>();

    const login = async (email: string, password: string) => new Promise<User>((resolve, reject) => {
        firstValueFrom(apiService.post<{ token: string, user: User }>('/user/login', { email, password }))
            .then((result) => {
                const { token, user } = result as { token: string, user: any };
                window.localStorage.setItem(SESSION_TOKEN_KEY, token);
                setToken(token);
                setUser(user);
                resolve(user);
            })
            .catch(reject);
    });
    
    const signup = async (email: string, password: string) => new Promise<User>((resolve, reject) => {
        firstValueFrom(apiService.post<{ token: string, user: User }>('/user/signup', { email, password }))
            .then((result) => {
                const { token, user } = result as { token: string, user: any };
                window.localStorage.setItem(SESSION_TOKEN_KEY, token);
                setToken(token);
                setUser(user);
                resolve(user);
            })
            .catch(reject);
    });

    const logout = () => {
        window.localStorage.removeItem(SESSION_TOKEN_KEY);
        setToken(undefined);
        setUser(undefined);
    };

    const loadSession = useCallback(async () => new Promise<User | undefined>((resolve, reject) => {
        const token = window.localStorage.getItem(SESSION_TOKEN_KEY);

        if (!token) return resolve(undefined);

        firstValueFrom(apiService.get<{ user: User }>('/user'))
            .then((result) => {
                setToken(token);
                setUser(result.user);
                resolve(result.user);
            })
            .catch(() => {
                logout();
                resolve(undefined);
            });
    }), []);

    const addCardToFavorite = useCallback(async (cardId: string) => new Promise<User>((resolve, reject) => {
        firstValueFrom(apiService.patch<{ user: User }>(`/user/favorites/add/${cardId}`))
            .then((result) => {
                setUser(result.user);
                resolve(result.user);
            })
            .catch((error) => {
                reject(error);
            });
    }), []);

    const deleteCardFromFavorite = useCallback(async (cardId: string) => new Promise<User>((resolve, reject) => {
        firstValueFrom(apiService.patch<{ user: User }>(`/user/favorites/delete/${cardId}`))
            .then((result) => {
                setUser(result.user);
                resolve(result.user);
            })
            .catch((error) => {
                reject(error);
            });
    }), []);

    useEffect(() => {
        loadSession()
            .finally(() => setLoaded(true));
    }, [loadSession]);

    return <SessionContext.Provider value={{ token, user, signup, login, loadSession, logout, addCardToFavorite, deleteCardFromFavorite }}>
        {!loaded ? <LoadingPage message="Loading session..." /> : children}
    </SessionContext.Provider>
}