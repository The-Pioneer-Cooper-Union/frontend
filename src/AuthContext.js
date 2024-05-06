import React, { useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                user.getIdTokenResult().then(idTokenResult => {
                    const isAdmin = idTokenResult.claims.admin || idTokenResult.claims.userType === 'ADMIN'; // Checks if the user has an admin claim or userType ADMIN
                    setCurrentUser({...user, isAdmin, userType: idTokenResult.claims.userType}); // Adds userType to the user object
                });
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    const logout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };
    const value = {
        currentUser,
        login: async (email, password) => {
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                return userCredential;
            } catch (error) {
                console.error('Login failed:', error);
                return false;
            }
        },
        logout: async () => {
            await auth.signOut();
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
