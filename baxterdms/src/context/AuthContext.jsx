import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from '../firebase';

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

    const updateUserPassword = async (newPassword, currentPassword) => {
        if (!user) {
            throw new Error('No user authenticated');
        }

        const userEmail = user.email;
        const credentials = EmailAuthProvider.credential(userEmail, currentPassword);
        await reauthenticateWithCredential(user, credentials);
        await updatePassword(user, newPassword);
    };

    const value = {
        user,
        updateUserPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };

export const useAuth = () => useContext(AuthContext);
