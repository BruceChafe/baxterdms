import { createContext, useState, useEffect, useContext } from "react";
import { auth } from '../firebase';
import {
    onAuthStateChanged,
    reauthenticateWithCredential,
    updatePassword,
    EmailAuthProvider
} from "firebase/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const updateUserPassword = async (newPassword) => {
        if (!user) {
            throw new Error('No user authenticated');
        }
        await updatePassword(user, newPassword);
    };

    const reauthenticate = async (currentPassword) => {
        if (!user) {
            throw new Error('User is not logged in.');
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        try {
            await reauthenticateWithCredential(user, credential);
        } catch (error) {
            throw new Error('Re-authentication failed: ' + error.message);
        }
    };

    const value = {
        user,
        updateUserPassword,
        reauthenticate,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
export const useAuth = () => useContext(AuthContext);