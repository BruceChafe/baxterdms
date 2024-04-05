import { createContext, useState, useEffect, useContext } from "react";
import { auth } from '../firebase';
import { onAuthStateChanged, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";

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
