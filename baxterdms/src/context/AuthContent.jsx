import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

const context = createContext();

const AuthContext = ({ children }) => {
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
    const values = {
        user: user,
        setUser: setUser
    }

return <context.Provider value={values}>
{!loading &&
    children
}
</context.Provider>
}
export default AuthContext;