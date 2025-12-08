import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { syncUser, listenToUserProfile } from '../services/usersService';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    userStatus: 'pending' | 'approved' | 'rejected' | null;
    googleAccessToken: string | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userStatus, setUserStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
    const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(() => {
        return localStorage.getItem('googleAccessToken');
    });

    useEffect(() => {
        let unsubscribeProfile: (() => void) | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Sync user data to Firestore (creates doc if new)
                await syncUser(currentUser);

                // Listen to real-time profile updates
                unsubscribeProfile = listenToUserProfile(currentUser.uid, (profile) => {
                    if (profile) {
                        setIsAdmin(profile.role === 'admin');
                        setUserStatus(profile.status);
                    }
                });
            } else {
                setIsAdmin(false);
                setUserStatus(null);
                setGoogleAccessToken(null);
                localStorage.removeItem('googleAccessToken');
                if (unsubscribeProfile) {
                    unsubscribeProfile();
                }
            }
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        };
    }, []);

    const login = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            if (credential?.accessToken) {
                setGoogleAccessToken(credential.accessToken);
                localStorage.setItem('googleAccessToken', credential.accessToken);
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setGoogleAccessToken(null);
            localStorage.removeItem('googleAccessToken');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, userStatus, googleAccessToken, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
