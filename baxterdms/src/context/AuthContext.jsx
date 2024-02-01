import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from '../firebase';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false)
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const updateUserPassword = async (newPassword) => {
        if (user) {
            try {
                const userEmail = user.email;
                const passwordPrompt = prompt('Please enter your current password:');
                const credentials = EmailAuthProvider.credential(userEmail, passwordPrompt);
    
                // Reauthenticate the user with the provided credentials
                await reauthenticateWithCredential(user, credentials);
    
                // If reauthentication is successful, update the password
                await updatePassword(user, newPassword);
            } catch (error) {
                console.error('Error updating password:', error);
                throw error;
            }
        } else {
            console.error('User not authenticated.');
        }
    };

    const values = {
        user: user,
        setUser: setUser,
        updatePassword: updateUserPassword
    }

    return (
        <AuthContext.Provider value={values}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext };