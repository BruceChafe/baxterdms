import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const UserData = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [cachedUID, setCachedUID] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async (uid) => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          setCachedUID(uid);
        } else {
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetails(null);
      }
    };

    if (user?.uid && user?.uid !== cachedUID) {
      fetchUserDetails(user.uid);
    }
  }, [user, cachedUID]);

  return <>{children(userDetails)}</>;
};

export default UserData;
