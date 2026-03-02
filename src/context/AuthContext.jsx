import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';
import { loginUser, getMyProfile } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // 1. First ensure user is registered/synced with backend
                    await loginUser();

                    // 2. Fetch full profile details from /me as per user's example
                    const response = await getMyProfile();

                    // The backend returns user object directly or with role/rollNo fields
                    setUser(response.data);
                    setIsUnauthorized(false);
                    setAuthError('');
                } catch (error) {
                    console.error('Error during backend auth sequence:', error);
                    if (error.response?.status === 403 || error.response?.data?.detail?.includes('kiit.ac.in')) {
                        setIsUnauthorized(true);
                        setAuthError(error.response?.data?.detail || 'Access restricted to @kiit.ac.in emails.');
                    } else {
                        setUser(null);
                    }
                }
            } else {
                setUser(null);
                setIsUnauthorized(false);
                setAuthError('');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async () => {
        try {
            setIsUnauthorized(false);
            setAuthError('');
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setIsUnauthorized(false);
            setAuthError('');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isUnauthorized,
        authError,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
